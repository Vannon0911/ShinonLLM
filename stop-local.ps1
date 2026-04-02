Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$ports = @(3000, 3001)
$connections = Get-NetTCPConnection -State Listen -ErrorAction SilentlyContinue | Where-Object {
  $ports -contains $_.LocalPort
}

if ($null -eq $connections -or $connections.Count -eq 0) {
  Write-Host "Keine Listener auf Ports 3000/3001 gefunden."
  exit 0
}

$pids = $connections.OwningProcess | Sort-Object -Unique
foreach ($pid in $pids) {
  try {
    $process = Get-Process -Id $pid -ErrorAction Stop
    Stop-Process -Id $pid -Force
    Write-Host "Beendet: PID $pid ($($process.ProcessName))"
  } catch {
    Write-Warning "Konnte PID $pid nicht beenden: $($_.Exception.Message)"
  }
}

Write-Host "Ports 3000/3001 sind jetzt frei."
