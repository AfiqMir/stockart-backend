# API Testing dengan cURL

Base URL default:

```bash
http://localhost:5000
```

Jalankan server:

```bash
npm run dev
```

## 1. Auth

### Register Pemilik

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "nama": "Owner StockArt",
    "username": "owner",
    "password": "password123",
    "role": "pemilik"
  }'
```

### Register Kasir

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "nama": "Kasir StockArt",
    "username": "kasir",
    "password": "password123",
    "role": "kasir"
  }'
```

### Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "owner",
    "password": "password123"
  }'
```

Simpan token dari response login:

```bash
TOKEN="isi_token_dari_response_login"
```

## 2. Product CRUD

Catatan role:

- `GET /api/products` bisa diakses `pemilik` dan `kasir`
- `POST`, `PUT`, dan `DELETE /api/products` hanya bisa diakses `pemilik`

### Create Product

```bash
curl -X POST http://localhost:5000/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZhYTlmMWYyYzQxZGI3NzhjZmZkODgxYyIsImlhdCI6MTc4OTUyOTQyOSwiZXhwIjoxNzg5NjE1ODI5fQ.eFTg3XkgDCoqSDC59LyAYzUIgD73EVoua72yylPyjY8" \
  -d '{
    "nama": "Buku Tulis",
    "kodeProduk": "PLP002",
    "kategori": "Alat Tulis",
    "hargaBeli": 3000,
    "hargaJual": 4500,
    "stok": 55,
    "satuan": "pcs",
    "stokMinimum": 5,
    "deskripsi": "Buku tulis ukuran sedang",
    "aktif": true
  }'
```

Simpan `_id` produk dari response:

```bash
PRODUCT_ID="isi_id_produk"
```

### Get All Products

```bash
curl -X GET http://localhost:5000/api/products \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZhYTlmMWYyYzQxZGI3NzhjZmZkODgxYyIsImlhdCI6MTc4OTUyOTQyOSwiZXhwIjoxNzg5NjE1ODI5fQ.eFTg3XkgDCoqSDC59LyAYzUIgD73EVoua72yylPyjY8"
```

### Get Product By ID

```bash
curl -X GET http://localhost:5000/api/products/$PRODUCT_ID \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZhYTlmMWYyYzQxZGI3NzhjZmZkODgxYyIsImlhdCI6MTc4OTUyOTQyOSwiZXhwIjoxNzg5NjE1ODI5fQ.eFTg3XkgDCoqSDC59LyAYzUIgD73EVoua72yylPyjY8"
```

### Update Product

```bash
curl -X PUT http://localhost:5000/api/products/$PRODUCT_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZhYTlmMWYyYzQxZGI3NzhjZmZkODgxYyIsImlhdCI6MTc4OTUyOTQyOSwiZXhwIjoxNzg5NjE1ODI5fQ.eFTg3XkgDCoqSDC59LyAYzUIgD73EVoua72yylPyjY8" \
  -d '{
    "nama": "Pulpen Hitam Premium",
    "hargaJual": 4000,
    "stok": 75
  }'
```

### Delete Product

```bash
curl -X DELETE http://localhost:5000/api/products/$PRODUCT_ID \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZhYTlmMWYyYzQxZGI3NzhjZmZkODgxYyIsImlhdCI6MTc4OTUyOTQyOSwiZXhwIjoxNzg5NjE1ODI5fQ.eFTg3XkgDCoqSDC59LyAYzUIgD73EVoua72yylPyjY8"
```

## 3. Transaction

Catatan role:

- `GET /api/transactions` bisa diakses `pemilik` dan `kasir`
- `POST /api/transactions/draft` bisa diakses `pemilik` dan `kasir`
- `POST /api/transactions` bisa diakses `pemilik` dan `kasir`
- `PATCH /api/transactions/:id/cancel` hanya bisa diakses `pemilik`

Pastikan kamu punya minimal 1 produk. Gunakan `PRODUCT_ID` dari produk yang sudah dibuat.

### Draft Transaction

Endpoint ini menghitung subtotal dan total tanpa menyimpan transaksi ke database.

```bash
curl -X POST http://localhost:5000/api/transactions/draft \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZhYTlmMWYyYzQxZGI3NzhjZmZkODgxYyIsImlhdCI6MTc4OTUyOTQyOSwiZXhwIjoxNzg5NjE1ODI5fQ.eFTg3XkgDCoqSDC59LyAYzUIgD73EVoua72yylPyjY8" \
  -d '{
    "detailBarang": [
      {
        "produk": "'"$PRODUCT_ID"'",
        "jumlah": 2
      }
    ]
  }'
```

### Create Transaction

Endpoint ini menyimpan transaksi. `hargaSatuan`, `subtotal`, dan `totalHarga` dihitung otomatis dari harga produk di database.

```bash
curl -X POST http://localhost:5000/api/transactions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZhYTlmMWYyYzQxZGI3NzhjZmZkODgxYyIsImlhdCI6MTc4OTUyOTQyOSwiZXhwIjoxNzg5NjE1ODI5fQ.eFTg3XkgDCoqSDC59LyAYzUIgD73EVoua72yylPyjY8" \
  -d '{
    "detailBarang": [
      {
        "produk": "'"$PRODUCT_ID"'",
        "jumlah": 2
      }
    ]
  }'
```

Simpan `_id` transaksi dari response:

```bash
TRANSACTION_ID="isi_id_transaksi"
```

### Get All Transactions

```bash
curl -X GET http://localhost:5000/api/transactions \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZhYTlmMWYyYzQxZGI3NzhjZmZkODgxYyIsImlhdCI6MTc4OTUyOTQyOSwiZXhwIjoxNzg5NjE1ODI5fQ.eFTg3XkgDCoqSDC59LyAYzUIgD73EVoua72yylPyjY8"
```

### Get Transaction By ID

```bash
curl -X GET http://localhost:5000/api/transactions/6aaa0956c41db778cffd8820 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZhYTlmMWYyYzQxZGI3NzhjZmZkODgxYyIsImlhdCI6MTc4OTUyOTQyOSwiZXhwIjoxNzg5NjE1ODI5fQ.eFTg3XkgDCoqSDC59LyAYzUIgD73EVoua72yylPyjY8"
```

### Cancel Transaction

Endpoint ini membatalkan transaksi dengan cara menghapus data transaksi dari database.

```bash
curl -X PATCH http://localhost:5000/api/transactions/6aaa0956c41db778cffd8820/cancel \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZhYTlmMWYyYzQxZGI3NzhjZmZkODgxYyIsImlhdCI6MTc4OTUyOTQyOSwiZXhwIjoxNzg5NjE1ODI5fQ.eFTg3XkgDCoqSDC59LyAYzUIgD73EVoua72yylPyjY8"
```

## 4. Contoh Alur Test Cepat

1. Jalankan `npm run dev`
2. Register user role `pemilik`
3. Login sebagai `pemilik`
4. Simpan token ke variable `TOKEN`
5. Create product
6. Simpan id produk ke variable `PRODUCT_ID`
7. Test draft transaction
8. Create transaction
9. Simpan id transaksi ke variable `TRANSACTION_ID`
10. Test get all, get by id, dan cancel transaction
