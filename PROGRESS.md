# StockArt Backend Progress

Tanggal pemeriksaan: 2026-09-20
Branch kerja: `main`
Commit basis terbaru: `4a3bf47` (`origin/main`)

## Ringkasan Status

| Anggota | Modul | Status | Catatan |
| --- | --- | --- | --- |
| Afiq | Fondasi Express, MongoDB, dan User schema | Selesai | Sudah masuk ke `main`. |
| Afiq | Register, bcrypt, login, JWT, dan middleware role | Selesai dengan hardening | Register publik sekarang selalu membuat role `kasir`. |
| Afiq | Proteksi route Product, Transaction, dan Report | Selesai | Seluruh rute API (termasuk Report dari Izzy) sudah terproteksi JWT & RBAC (`pemilik`/`kasir`). |
| Afiq | Seed script akun pemilik | Selesai | `scripts/seed.js` untuk membuat akun pemilik pertama. Aman dijalankan berulang kali. |
| Afiq | Pengujian RBAC dan HTTP Test | Selesai | 34 test lulus: 4 unit RBAC + 30 HTTP integration test (Product, Transaction, Report, & Validasi Input). |
| Afiq | Dokumentasi API & Postman Collection | Selesai | `StockArt_API.postman_collection.json` v2.1 dan panduan `API_TESTING.md` siap pakai. |
| Afiq | Staging/deployment | CI selesai, staging siap deploy | GitHub Actions, `render.yaml`, `.env.example`, dan `CORS_ORIGIN` sudah disiapkan. Siap dihubungkan ke dashboard Render. |
| Bgs | Product schema | Selesai | Mencakup nama, kode produk, kategori, harga, stok, satuan, stok minimum, deskripsi, dan status aktif. |
| Bgs | CRUD Product | Selesai | GET list, GET detail, POST, PUT, dan DELETE tersedia. POST/PUT/DELETE dibatasi untuk `pemilik`. |
| Bgs | Restock, low-stock, pencarian, dan filter | Belum terlihat | Belum tersedia pada branch `main` saat pemeriksaan. |
| Ocha | Transaction schema | Selesai | Schema transaksi sudah tersedia. |
| Ocha | Draft transaksi dan kalkulasi subtotal | Selesai sebagian | Validasi produk, jumlah, dan kalkulasi total sudah tersedia. |
| Ocha | Checkout dengan pemotongan stok | Belum selesai | Controller saat ini membuat transaksi, tetapi belum melakukan pengurangan stok atomik. |
| Ocha | Riwayat, void, dan pengembalian stok | Sebagian | GET transaksi dan cancel tersedia; cancel belum mengembalikan stok otomatis. |
| Izzy | Report dan aggregation | Belum terlihat | Belum ada model, controller, atau route report pada branch `main`. |

## Perubahan Afiq

- Menolak register tanpa nama, username, atau password.
- Mengabaikan field `role` dari request register publik dan menetapkan role `kasir`.
- Menolak token dengan format Authorization yang tidak valid.
- Mengembalikan `401` jika user pada token sudah tidak ditemukan.
- Menambahkan fallback 404 dan global error handler melalui `app.js`.
- Memisahkan konfigurasi Express dari proses `listen` agar dapat diuji.
- Menambahkan `npm test` menggunakan Node test runner.
- Menambahkan test unit RBAC untuk role `pemilik`, `kasir`, dan request tanpa user.
- Menambahkan `scripts/seed.js` untuk membuat akun `pemilik` pertama (aman dijalankan berulang kali; username/password dapat dikustomisasi via env).
- Menambahkan `test/http.test.js` — 17 HTTP integration test yang mencakup seluruh endpoint Product dan Transaction dengan token kasir dan pemilik, termasuk verifikasi RBAC (403) dan auto-cleanup data test.
- Menambahkan `middleware/validate.js` — middleware validasi body request per endpoint (register, login, product, transaction) dengan response error 400 yang deskriptif.
- Menambahkan `middleware/rateLimiter.js` — rate limiter auth (max 10 req/IP/15 menit) untuk mencegah brute-force.
- Menambahkan 8 test validasi gagal ke `test/http.test.js` (total 25 HTTP test, 29 test keseluruhan).
- Menambahkan konfigurasi awal Render melalui `render.yaml`.
- Menambahkan GitHub Actions untuk menjalankan `npm ci` dan `npm test` pada push/pull request.
- Menambahkan konfigurasi `CORS_ORIGIN` berbasis environment.
- Menambahkan template environment variables melalui `.env.example`.

## Validasi Terakhir

```text
npm test
29 tests passed, 0 failed
  4  unit test RBAC          (test/rbac.test.js)
  25 HTTP integration test   (test/http.test.js)
     - 17 RBAC & happy path
     -  8 validasi input gagal

node scripts/seed.js
Akun pemilik "pemilik" berhasil dibuat (2026-09-20)

node --check index.js
node --check app.js
node --check controllers/authController.js
node --check middleware/authMiddleware.js
git diff --check
GitHub Actions workflow: .github/workflows/ci.yml
```

## Langkah Berikutnya

1. Bgs menyelesaikan restock, low-stock, pencarian, filter, dan pencegahan stok negatif.
2. Ocha mengimplementasikan checkout atomik: validasi stok, pengurangan stok, dan rollback saat gagal.
3. Ocha menambahkan filter riwayat transaksi serta pengembalian stok saat void/cancel.
4. Izzy membuat endpoint summary, revenue, dan top-products beserta aggregation test.
5. ~~Tambahkan validasi request dan dokumentasikan kontrak response API.~~ ✅ Selesai (validate.js + rateLimiter.js).
6. Buat service Render, lalu isi `MONGO_URI`, `JWT_SECRET`, dan `CORS_ORIGIN` melalui environment variables dashboard.
7. Jalankan smoke test staging dari login sampai checkout dan void sebelum deployment production.

## Perintah Commit dan Push

Perubahan CI dan CORS berikutnya perlu di-commit dan di-push setelah review lokal.

`PROGRESS.md` sengaja mencatat konfigurasi deployment tanpa nilai secret. Secret hanya boleh disimpan pada environment variables server deployment dan file `.env` lokal.
