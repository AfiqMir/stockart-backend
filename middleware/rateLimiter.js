/**
 * Rate limiter untuk endpoint autentikasi.
 *
 * Membatasi jumlah request ke /api/auth/login dan /api/auth/register
 * untuk mencegah brute-force attack.
 *
 * Batas: 10 request per IP per 15 menit.
 * Response jika melebihi batas: 429 Too Many Requests.
 */

'use strict';

const rateLimit = require('express-rate-limit');

const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 menit
  max: 10,                   // maksimal 10 request per window per IP
  standardHeaders: true,     // kirim header RateLimit-* standar (RFC 6585)
  legacyHeaders: false,      // nonaktifkan header X-RateLimit-* lama
  message: {
    success: false,
    message: 'Terlalu banyak percobaan. Coba lagi dalam 15 menit.',
  },
});

module.exports = { authRateLimiter };
