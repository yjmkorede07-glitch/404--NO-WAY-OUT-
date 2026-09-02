param(
  [Parameter(Mandatory=$true)][string]$SourceDir,
  [Parameter(Mandatory=$true)][string]$TargetDir
)
$ErrorActionPreference = 'Stop'
if (!(Test-Path $SourceDir)) { throw "Source directory not found: $SourceDir" }
if (!(Test-Path (Join-Path $TargetDir '.git'))) { throw "Target must be an existing Git repository clone: $TargetDir" }
Set-Location $TargetDir
$status = git status --porcelain
if ($status) { throw 'Target repo has uncommitted changes. Commit or stash them first.' }
$stamp = Get-Date -Format 'yyyyMMdd-HHmmss'
$backup = Join-Path $TargetDir ".404_merge_backup_$stamp"
New-Item -ItemType Directory -Path $backup | Out-Null
foreach ($f in @('README.md','.gitignore','.gitattributes')) {
  $p = Join-Path $TargetDir $f
  if (Test-Path $p) { Copy-Item $p (Join-Path $backup $f) -Force }
}
foreach ($d in @('Assets','Packages','ProjectSettings','Legacy','.github','Docs')) {
  $src = Join-Path $SourceDir $d
  if (Test-Path $src) { Copy-Item $src $TargetDir -Recurse -Force }
}
$toolSrc = Join-Path $SourceDir 'Tools/GitHub'
if (Test-Path $toolSrc) { New-Item -ItemType Directory -Path (Join-Path $TargetDir 'Tools') -Force | Out-Null; Copy-Item $toolSrc (Join-Path $TargetDir 'Tools') -Recurse -Force }
Get-ChildItem $SourceDir -File | Where-Object { $_.Name -notmatch '\.(zip|7z|rar)$' -and $_.Name -notmatch '^\.git$' } | ForEach-Object {
  Copy-Item $_.FullName (Join-Path $TargetDir $_.Name) -Force
}
Write-Host "Merge prepared. No commit or push was performed."
Write-Host "Review with: git status; git diff"
Write-Host "Backup: $backup"
