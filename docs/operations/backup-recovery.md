# Backup & Recovery

## Targets

- RPO: 24 hours for standard deployments, lower when managed database PITR is available.
- RTO: 4 hours for standard VPS recovery, lower for managed cloud deployments.

## PostgreSQL Backup

Use `infrastructure/scripts/backup-postgres.ps1` from a trusted machine with `pg_dump` available.

```powershell
$env:DATABASE_URL="postgresql://user:password@host:5432/simbolo"
.\infrastructure\scripts\backup-postgres.ps1
```

## PostgreSQL Restore

Use `restore-postgres.ps1` after provisioning an empty compatible PostgreSQL database.

```powershell
$env:DATABASE_URL="postgresql://user:password@host:5432/simbolo"
.\infrastructure\scripts\restore-postgres.ps1 -BackupPath C:\tmp\simbolo-backups\simbolo.dump
```

## Media Backup

- Local storage: back up the `uploads/` volume daily.
- R2/S3: enable object versioning and lifecycle policies.
- Verify restore monthly by restoring a sample database and media object set.
