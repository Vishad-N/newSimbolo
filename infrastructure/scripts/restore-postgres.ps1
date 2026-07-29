param(
  [Parameter(Mandatory = $true)][string]$BackupPath,
  [string]$DatabaseUrl = $env:DATABASE_URL
)

if (-not $DatabaseUrl) {
  throw "DATABASE_URL is required"
}

if (-not (Test-Path -LiteralPath $BackupPath)) {
  throw "Backup file not found: $BackupPath"
}

pg_restore --clean --if-exists --dbname=$DatabaseUrl $BackupPath
Write-Host "Restore completed from $BackupPath"
