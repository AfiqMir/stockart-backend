const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware untuk memproteksi route (wajib login)
const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    /^Bearer\s+\S+$/.test(req.headers.authorization)
  ) {
    try {
      // Ambil token dari header Authorization: Bearer <TOKEN>
      token = req.headers.authorization.split(' ')[1];

      // Verifikasi token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Ambil data user dari database (tanpa password)
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({ message: 'User tidak ditemukan' });
      }

      next(); // Lanjut ke controller berikutnya
    } catch (error) {
      return res.status(401).json({ message: 'Tidak terotorisasi, token gagal' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Tidak terotorisasi, tidak ada token' });
  }
};

// Middleware opsional untuk membatasi akses berdasarkan role (misal: khusus pemilik)
const authorize = (...roles) => {
  return (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
    message: 'Role tidak memiliki akses ke rute ini'
      });
    }
    next();
  };
};

module.exports = { protect, authorize };