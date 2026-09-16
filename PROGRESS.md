# StockArt Backend Progress

Tanggal pemeriksaan: 2026-09-16
Branch kerja: `afiq/auth-setup`
Commit basis terbaru: `f29c394` (`origin/main`)

## Ringkasan Status

| Anggota | Modul | Status | Catatan |
| --- | --- | --- | --- |
| Afiq | Fondasi Express, MongoDB, dan User schema | Selesai | Sudah masuk ke `main`. |
| Afiq | Register, bcrypt, login, JWT, dan middleware role | Selesai dengan hardening lokal | Perubahan terbaru belum dipush. Register publik sekarang selalu membuat role `kasir`. |
| Afiq | Proteksi route Product dan Transaction | Terintegrasi | Route pada `main` sudah memakai `protect` dan `authorize`. |
| Afiq | Pengujian RBAC | Selesai untuk skenario dasar | 4 test Node bawaan lulus. Cakupan masih perlu diperluas ke request HTTP dan database. |
| Afiq | Staging/deployment | Konfigurasi awal selesai | `render.yaml` sudah dibuat. Service dan environment variables masih perlu dibuat di dashboard Render. |
| Bgs | Product schema | Selesai | Mencakup nama, kode produk, kategori, harga, stok, satuan, stok minimum, deskripsi, dan status aktif. |
| Bgs | CRUD Product | Selesai | GET list, GET detail, POST, PUT, dan DELETE tersedia. POST/PUT/DELETE dibatasi untuk `pemilik`. |
| Bgs | Restock, low-stock, pencarian, dan filter | Belum terlihat | Belum tersedia pada branch `main` saat pemeriksaan. |
| Ocha | Transaction schema | Selesai | Schema transaksi sudah tersedia. |
| Ocha | Draft transaksi dan kalkulasi subtotal | Selesai sebagian | Validasi produk, jumlah, dan kalkulasi total sudah tersedia. |
| Ocha | Checkout dengan pemotongan stok | Belum selesai | Controller saat ini membuat transaksi, tetapi belum melakukan pengurangan stok atomik. |
| Ocha | Riwayat, void, dan pengembalian stok | Sebagian | GET transaksi dan cancel tersedia; cancel belum mengembalikan stok otomatis. |
| Izzy | Report dan aggregation | Belum terlihat | Belum ada model, controller, atau route report pada branch `main`. |

## Perubahan Afiq Saat Ini

- Menolak register tanpa nama, username, atau password.
- Mengabaikan field `role` dari request register publik dan menetapkan role `kasir`.
- Menolak token dengan format Authorization yang tidak valid.
- Mengembalikan `401` jika user pada token sudah tidak ditemukan.
- Menambahkan fallback 404 dan global error handler melalui `app.js`.
- Memisahkan konfigurasi Express dari proses `listen` agar dapat diuji.
- Menambahkan `npm test` menggunakan Node test runner.
- Menambahkan test dasar untuk role `pemilik`, `kasir`, dan request tanpa user.
- Menambahkan konfigurasi awal Render melalui `render.yaml`.

## Validasi Terakhir

```text
npm test
4 tests passed, 0 failed

node --check index.js
node --check app.js
node --check controllers/authController.js
node --check middleware/authMiddleware.js
git diff --check
```

## Langkah Berikutnya

1. Review perubahan Afiq lalu commit dan push ke branch pribadi.
2. Tambahkan test HTTP untuk endpoint Product dan Transaction dengan token kasir serta pemilik.
3. Tentukan mekanisme pembuatan akun pemilik, misalnya seed script atau endpoint pemilik yang sudah terproteksi.
4. Bgs menyelesaikan restock, low-stock, pencarian, filter, dan pencegahan stok negatif.
5. Ocha mengimplementasikan checkout atomik: validasi stok, pengurangan stok, dan rollback saat gagal.
6. Ocha menambahkan filter riwayat transaksi serta pengembalian stok saat void.
7. Izzy membuat endpoint summary, revenue, dan top-products beserta aggregation test.
8. Tambahkan validasi request dan dokumentasikan kontrak response API.
9. Buat service Render, lalu isi `MONGO_URI` dan `JWT_SECRET` melalui environment variables dashboard, bukan file repository.
10. Jalankan smoke test staging dari login sampai checkout dan void sebelum deployment production.

## Perintah Commit dan Push

```powershell
git add .
git commit -m "fix: harden auth and add RBAC tests"
git push origin afiq/auth-setup
```

`PROGRESS.md` sengaja mencatat konfigurasi deployment tanpa nilai secret. Secret hanya boleh disimpan pada environment variables server deployment dan file `.env` lokal.
