$ErrorActionPreference = "Continue" # Don't stop on error, just log it

$root = "e:\vibe-plugin"
$outputFile = "$root\Codex_Complete.md"
$srcDir = "$root\src"

Write-Host "Starting Robust Codex Generation..."

# Initialize File
$header = @"
# 🕋 VIBE SYSTEM CODEX (OMNI-ARCHIVE)
> **CLASSIFICATION:** TOP SECRET // VIBE ARCHITECT EYES ONLY
> **GENERATED:** $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")
> **SCOPE:** FULL RECURSIVE SOURCE DUMP
> **NOTE:** This file is auto-generated to ensure 100% code coverage.

---
"@

try {
    Set-Content -Path $outputFile -Value $header -Encoding UTF8 -Force
}
catch {
    Write-Error "Failed to create output file: $_"
    exit 1
}

# Function to append file content
function Append-File {
    param (
        [string]$Path,
        [string]$Title,
        [string]$Lang
    )
    
    if (Test-Path $Path) {
        Write-Host "Processing: $Title"
        
        try {
            $content = Get-Content -Path $Path -Raw -Encoding UTF8 -ErrorAction Stop
            
            $block = @"

---

## $Title
> Path: `$Path

```$Lang
$content
```
"@
            Add-Content -Path $outputFile -Value $block -Encoding UTF8 -Force
        }
        catch {
            Write-Warning "FAILED to read/write $Title : $_"
        }
    }
    else {
        Write-Warning "File not found: $Path"
    }
}

# 1. Config Files
Append-File "$root\package.json" "System Configuration" "json"
Append-File "$root\tsconfig.json" "TypeScript Config" "json"
Append-File "$root\manifest.json" "Plugin Manifest" "json"
Append-File "$root\vite.config.ts" "Vite Config" "typescript"
Append-File "$root\eslint.config.js" "ESLint Config" "javascript"

# 2. Source Files (Recursive)
try {
    $files = Get-ChildItem -Path $srcDir -Recurse -File -ErrorAction Stop | Sort-Object FullName
}
catch {
    Write-Error "Failed to list source directory: $_"
    exit 1
}

foreach ($file in $files) {
    # Skip excluded
    if ($file.FullName -like "*\archived\*") { continue }
    if ($file.FullName -like "*\node_modules\*") { continue }
    if ($file.FullName -like "*\dist\*") { continue }
    
    $relPath = $file.FullName.Substring($root.Length).Replace("\", "/")
    
    # Determine Language
    $lang = "typescript"
    switch ($file.Extension) {
        ".tsx" { $lang = "typescript" }
        ".ts" { $lang = "typescript" }
        ".css" { $lang = "css" }
        ".js" { $lang = "javascript" }
        ".json" { $lang = "json" }
        ".svg" { $lang = "xml" }
        ".md" { $lang = "markdown" }
    }
    
    Append-File $file.FullName $relPath $lang
}

Write-Host "✅ Codex Generation Process Finished."
Write-Host "Output File: $outputFile"
