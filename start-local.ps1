Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

function Resolve-NpmCommand {
  $npm = Get-Command npm -ErrorAction SilentlyContinue
  if ($null -ne $npm -and -not [string]::IsNullOrWhiteSpace($npm.Source)) {
    return $npm.Source
  }

  $fallback = "C:\Program Files\nodejs\npm.cmd"
  if (Test-Path -LiteralPath $fallback -PathType Leaf) {
    return $fallback
  }

  throw "npm wurde nicht gefunden. Installiere Node.js oder fuege npm zu PATH hinzu."
}

function Start-ShinonLocalStack {
  [CmdletBinding()]
  param()

  $repoRoot = if (-not [string]::IsNullOrWhiteSpace($PSScriptRoot)) {
    $PSScriptRoot
  } else {
    (Get-Location).Path
  }

  $npmCommand = Resolve-NpmCommand
  $backendPath = Join-Path $repoRoot "backend"
  $frontendPath = Join-Path $repoRoot "frontend"

  if (-not (Test-Path -LiteralPath $backendPath -PathType Container)) {
    throw "Backend-Verzeichnis fehlt: $backendPath"
  }
  if (-not (Test-Path -LiteralPath $frontendPath -PathType Container)) {
    throw "Frontend-Verzeichnis fehlt: $frontendPath"
  }

  $backendCmd = "Set-Location -LiteralPath '$backendPath'; & '$npmCommand' run dev"
  $frontendCmd = "Set-Location -LiteralPath '$frontendPath'; & '$npmCommand' run dev"

  Start-Process -FilePath "powershell" -ArgumentList @(
    "-NoExit",
    "-ExecutionPolicy", "Bypass",
    "-Command", $backendCmd
  ) | Out-Null

  Start-Process -FilePath "powershell" -ArgumentList @(
    "-NoExit",
    "-ExecutionPolicy", "Bypass",
    "-Command", $frontendCmd
  ) | Out-Null

  Write-Host "Lokaler Stack gestartet:"
  Write-Host "- Backend:  http://127.0.0.1:3001"
  Write-Host "- Frontend: http://127.0.0.1:3000"
}

if ($MyInvocation.InvocationName -ne ".") {
  try {
    Start-ShinonLocalStack
  } catch {
    Write-Error $_
    exit 1
  }
}
