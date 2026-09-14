const express = require('express');
const router = express.Router();

const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');

const {
  protect,
  authorize,
} = require('../middleware/authMiddleware');

// Owner dan cashier dapat melihat produk
router.get('/', protect, getProducts);
router.get('/:id', protect, getProductById);

// Hanya owner yang dapat mengelola produk
router.post('/', protect, authorize('pemilik'), createProduct);
router.put('/:id', protect, authorize('pemilik'), updateProduct);
router.delete('/:id', protect, authorize('pemilik'), deleteProduct);

module.exports = router;