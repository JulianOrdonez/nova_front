#!/usr/bin/env pwsh

$baseUrl = "http://localhost:3001"
$delay = 3

Write-Host "Esperando que el servidor esté listo..." -ForegroundColor Cyan
Start-Sleep -Seconds $delay

Write-Host "`n--- Testeando API NOVA Backend ---`n" -ForegroundColor Green

# Test 1: GET /api/products
Write-Host "1. GET /api/products" -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/api/products" -Method Get -ErrorAction Stop
    $data = $response.Content | ConvertFrom-Json
    Write-Host "Status: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "Productos encontrados: $($data.count)" -ForegroundColor White
    $data.data | ForEach-Object { Write-Host "- $($_.name)" }
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 2: GET /api/services
Write-Host "`n2. GET /api/services" -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/api/services" -Method Get -ErrorAction Stop
    $data = $response.Content | ConvertFrom-Json
    Write-Host "Status: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "Servicios encontrados: $($data.count)" -ForegroundColor White
    $data.data | ForEach-Object { Write-Host "- $($_.title)" }
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 3: GET /api/products/[slug]
Write-Host "`n3. GET /api/products/nova-pro-wireless" -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/api/products/nova-pro-wireless" -Method Get -ErrorAction Stop
    $data = $response.Content | ConvertFrom-Json
    Write-Host "Status: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "Producto: $($data.data.name)" -ForegroundColor White
    Write-Host "Precio: $($data.data.price)" -ForegroundColor White
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 4: POST /api/contact
Write-Host "`n4. POST /api/contact" -ForegroundColor Yellow
try {
    $body = @{
        name = "Test User"
        email = "test@example.com"
        message = "Este es un mensaje de prueba"
    } | ConvertTo-Json

    $response = Invoke-WebRequest -Uri "$baseUrl/api/contact" `
        -Method Post `
        -ContentType "application/json" `
        -Body $body `
        -ErrorAction Stop
    
    $data = $response.Content | ConvertFrom-Json
    Write-Host "Status: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "Resultado: $($data.data.message)" -ForegroundColor White
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`nTests completados" -ForegroundColor Green
