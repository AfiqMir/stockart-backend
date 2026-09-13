const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware untuk memproteksi route (wajib login)
const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Ambil token dari header Authorization: Bearer <TOKEN>
      token = req.headers.authorization.split(' ')[1];

      // Verifikasi token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Ambil data user dari database (tanpa password)
      req.user = await User.findById(decoded.id).select('-password');

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
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Role ${req.user.role} tidak memiliki akses ke rute ini`
      });
    }
    next();
  };
};

module.exports = { protect, authorize };