Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

function Start-LlamaCppServer {
  [CmdletBinding()]
  param(
    [string]$ModelFile = 'qwen2.5-0.5b-instruct-q4_k_m.gguf',
    [int]$Port = 8000,
    [int]$HealthTimeout = 60
  )

  $repoRoot = Join-Path $PSScriptRoot '..\..'
  $modelPath = Join-Path $repoRoot "ops\models\$ModelFile"
  
  if (-not (Test-Path -LiteralPath $modelPath -PathType Leaf)) {
    throw "Model not found at $modelPath. Please place it in ops\models."
  }

  Write-Host "Checking for llama-server.exe or using Docker fallback..."
  
  # Try to find llama-server.exe in common places
  $llamaBinary = Get-Command llama-server.exe -ErrorAction SilentlyContinue
  
  if ($null -ne $llamaBinary) {
    Write-Host "Starting local llama-server.exe binary..."
    $serverCmd = "& $($llamaBinary.Source) -m '$modelPath' --port $Port --host 0.0.0.0 -n 512"
    Start-Process powershell -ArgumentList "-NoExit", "-Command", $serverCmd
  } else {
    Write-Host "llama-server.exe not found in PATH. Using Docker fallback (ghcr.io/ggerganov/llama.cpp:server)..."
    $composeFile = Join-Path $repoRoot "ops\docker-compose.local.yml"
    
    if (-not (Test-Path -LiteralPath $composeFile -PathType Leaf)) {
      throw "Docker compose file not found at $composeFile"
    }
    
    # Start only the llamacpp service
    $env:LLAMACPP_MODEL_FILE = $ModelFile
    $dockerCmd = "docker compose -f '$composeFile' -p llmrab-local up -d llamacpp"
    Invoke-Expression $dockerCmd
  }

  # Wait for health check
  Write-Host "Waiting for llama.cpp server to become healthy on port $Port..."
  $healthUrl = "http://127.0.0.1:$Port/health"
  $deadline = (Get-Date).AddSeconds($HealthTimeout)
  
  while ((Get-Date) -lt $deadline) {
    try {
      $resp = Invoke-RestMethod -Uri $healthUrl -Method Get -ErrorAction Stop
      if ($resp.status -eq 'ok' -or $resp.ok -eq $true) {
        Write-Host "llama.cpp is READY."
        return
      }
    } catch {
      # Ignore connection errors while waiting
    }
    Write-Host "." -NoNewline
    Start-Sleep -Seconds 2
  }
  
  throw "llama.cpp did not become healthy within $HealthTimeout seconds."
}

if ($MyInvocation.InvocationName -ne '.') {
  try {
    Start-LlamaCppServer
  } catch {
    Write-Error $_
    exit 1
  }
}
