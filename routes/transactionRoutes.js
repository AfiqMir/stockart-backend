const express = require('express');
const router = express.Router();

const {
  getTransactions,
  getTransactionById,
  createTransaction,
  cancelTransaction,
} = require('../controllers/transactionController');

const {
  protect,
  authorize,
} = require('../middleware/authMiddleware');

// Owner dan cashier dapat melihat transaksi
router.get('/', protect, getTransactions);
router.get('/:id', protect, getTransactionById);

// Cashier dan owner dapat membuat transaksi
router.post('/', protect, authorize('kasir', 'pemilik'), createTransaction);

// Hanya owner yang dapat membatalkan transaksi
router.patch('/:id/cancel', protect, authorize('pemilik'), cancelTransaction);

module.exports = router;
