param(
  [string]$DatabaseUrl = $env:DATABASE_URL,
  [string]$BackupDir = "C:\tmp\simbolo-backups"
)

if (-not $DatabaseUrl) {
  throw "DATABASE_URL is required"
}

New-Item -ItemType Directory -Force -Path $BackupDir | Out-Null
$timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
$backupPath = Join-Path $BackupDir "simbolo-$timestamp.dump"

pg_dump $DatabaseUrl --format=custom --file=$backupPath
Write-Host "Backup written to $backupPath"
