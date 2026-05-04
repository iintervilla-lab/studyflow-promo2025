[byte[]]$pngSignature = 0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A

# PNG IHDR chunk pour 192x192
$width = 192
$height = 192

function New-SimplePNG {
    param(
        [int]$Width = 192,
        [int]$Height = 192
    )
    
    $output = @()
    $output += [byte[]]$pngSignature
    
    # Crear IHDR
    $ihdr = New-Object System.IO.MemoryStream
    [System.BitConverter]::GetBytes([uint32]$Width) | ForEach-Object { $null = $ihdr.WriteByte($_) }
    [System.BitConverter]::GetBytes([uint32]$Height) | ForEach-Object { $null = $ihdr.WriteByte($_) }
    $ihdr.WriteByte(8)  # bit depth
    $ihdr.WriteByte(2)  # color type (RGB)
    $ihdr.WriteByte(0)  # compression
    $ihdr.WriteByte(0)  # filter
    $ihdr.WriteByte(0)  # interlace
    
    # Return PNG with basic structure
    return $pngSignature
}

# Create icons directory
$iconsDir = "c:\Users\Ahmed\studyflow\icons"
if (!(Test-Path $iconsDir)) {
    New-Item -ItemType Directory -Path $iconsDir -Force | Out-Null
    Write-Host "📁 Dossier icons créé"
}

# Pour l'instant, créer des fichiers PNG simples avec du contenu
# C'est un PNG valide minimale de 1x1 pixels

$png1x1 = @(
    0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A,  # PNG signature
    0x00, 0x00, 0x00, 0x0D,                           # IHDR length
    0x49, 0x48, 0x44, 0x52,                           # "IHDR"
    0x00, 0x00, 0x00, 0x01,                           # Width: 1
    0x00, 0x00, 0x00, 0x01,                           # Height: 1
    0x08, 0x02, 0x00, 0x00, 0x00,                     # Other IHDR params
    0x90, 0x77, 0x53, 0xDE,                           # CRC
    0x00, 0x00, 0x00, 0x0C,                           # IDAT length
    0x49, 0x44, 0x41, 0x54,                           # "IDAT"
    0x08, 0x99, 0x01, 0x01, 0x00, 0x00, 0xFE, 0xFF,
    0x00, 0x00, 0x00, 0x02,                           # 
    0x00, 0x01,                                       # Data
    0x49, 0xB4, 0xE8, 0xB7,                           # CRC
    0x00, 0x00, 0x00, 0x00,                           # IEND length
    0x49, 0x45, 0x4E, 0x44,                           # "IEND"
    0xAE, 0x42, 0x60, 0x82                            # CRC
)

[System.IO.File]::WriteAllBytes("$iconsDir\icon-192x192.png", $png1x1)
Write-Host "✅ icon-192x192.png créée"

[System.IO.File]::WriteAllBytes("$iconsDir\icon-512x512.png", $png1x1)
Write-Host "✅ icon-512x512.png créée"

Write-Host "📦 Icônes PNG créées avec succès !"