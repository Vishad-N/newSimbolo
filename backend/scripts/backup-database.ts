/**
 * Dumps the full Postgres database and uploads it to R2, since Supabase's free
 * tier (what this project runs on) doesn't provide any automated backups —
 * losing the DB with no backup would mean losing every order, payment,
 * commission, and client record permanently.
 *
 * Uses DIRECT_URL (not the pooled DATABASE_URL) because pg_dump needs a
 * consistent snapshot across multiple queries in one session — PgBouncer's
 * transaction-pooling mode can hand those queries to different underlying
 * connections and break that consistency. This mirrors the same DIRECT_URL
 * convention already used for Prisma migrations (see scripts/with-direct-url.js).
 *
 * Run via: npm run backup:database --workspace backend
 * Intended to run on a schedule (see .github/workflows/database-backup.yml),
 * not as part of the normal app boot/deploy path.
 */
import 'dotenv/config';
import { spawnSync } from 'node:child_process';
import { gzipSync } from 'node:zlib';
import { S3Client, PutObjectCommand, ListObjectsV2Command, DeleteObjectCommand } from '@aws-sdk/client-s3';

const RETENTION_DAYS = 14;
const BACKUP_PREFIX = 'backups/';

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function dumpDatabase(directUrl: string): Buffer {
  console.log('Running pg_dump...');
  const result = spawnSync('pg_dump', [directUrl, '--format=plain', '--no-owner', '--no-privileges'], {
    maxBuffer: 1024 * 1024 * 1024, // 1GB — generous headroom for a small/medium DB
    encoding: 'buffer',
  });

  if (result.error) {
    throw new Error(`Failed to run pg_dump — is postgresql-client installed? ${result.error.message}`);
  }
  if (result.status !== 0) {
    const stderr = result.stderr?.toString('utf8') ?? '';
    throw new Error(`pg_dump exited with code ${result.status}: ${stderr}`);
  }

  return result.stdout;
}

async function uploadBackup(client: S3Client, bucket: string, key: string, body: Buffer): Promise<void> {
  console.log(`Uploading ${key} (${(body.length / 1024 / 1024).toFixed(2)} MB) to R2...`);
  await client.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: body,
      ContentType: 'application/gzip',
    }),
  );
}

async function pruneOldBackups(client: S3Client, bucket: string): Promise<void> {
  const cutoff = new Date(Date.now() - RETENTION_DAYS * 24 * 60 * 60 * 1000);
  const listing = await client.send(new ListObjectsV2Command({ Bucket: bucket, Prefix: BACKUP_PREFIX }));

  const stale = (listing.Contents ?? []).filter((obj) => obj.Key && obj.LastModified && obj.LastModified < cutoff);
  if (stale.length === 0) {
    console.log('No backups older than retention window — nothing to prune.');
    return;
  }

  console.log(`Pruning ${stale.length} backup(s) older than ${RETENTION_DAYS} days...`);
  for (const obj of stale) {
    await client.send(new DeleteObjectCommand({ Bucket: bucket, Key: obj.Key! }));
    console.log(`  deleted ${obj.Key}`);
  }
}

async function main() {
  const directUrl = requireEnv('DIRECT_URL');
  const accountId = requireEnv('R2_ACCOUNT_ID');
  const accessKeyId = requireEnv('R2_ACCESS_KEY_ID');
  const secretAccessKey = requireEnv('R2_SECRET_ACCESS_KEY');
  const bucket = requireEnv('R2_BUCKET_NAME');

  const dump = dumpDatabase(directUrl);
  const compressed = gzipSync(dump);

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const key = `${BACKUP_PREFIX}${timestamp}.sql.gz`;

  const client = new S3Client({
    region: 'auto',
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: { accessKeyId, secretAccessKey },
    forcePathStyle: true,
  });

  await uploadBackup(client, bucket, key, compressed);
  await pruneOldBackups(client, bucket);

  console.log('Backup complete.');
}

main().catch((error) => {
  console.error('Database backup failed:', error);
  process.exit(1);
});
