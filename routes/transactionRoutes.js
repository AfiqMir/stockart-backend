const express = require('express');
const router = express.Router();

const {
  getTransactions,
  getTransactionById,
  draftTransaction,
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

// Cashier dan owner dapat menghitung draft dan membuat transaksi
router.post('/draft', protect, authorize('kasir', 'pemilik'), draftTransaction);
router.post('/', protect, authorize('kasir', 'pemilik'), createTransaction);

// Hanya owner yang dapat membatalkan transaksi
router.patch('/:id/cancel', protect, authorize('pemilik'), cancelTransaction);

module.exports = router;
