const Transaction = require('../models/Transaction');
const Product = require('../models/Product');

// GET /api/transactions
exports.getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find()
      .populate('kasir', 'nama username role')
      .populate('detailBarang.produk', 'nama kodeProduk hargaJual')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: transactions,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil data transaksi',
      error: error.message,
    });
  }
};

// GET /api/transactions/:id
exports.getTransactionById = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id)
      .populate('kasir', 'nama username role')
      .populate('detailBarang.produk', 'nama kodeProduk hargaJual');

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaksi tidak ditemukan',
      });
    }

    res.status(200).json({
      success: true,
      data: transaction,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'ID transaksi tidak valid',
    });
  }
};

// POST /api/transactions
exports.createTransaction = async (req, res) => {
  try {
    const { detailBarang } = req.body;

    if (!Array.isArray(detailBarang) || detailBarang.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Detail barang minimal berisi 1 produk',
      });
    }

    const calculatedDetailBarang = [];

    for (const item of detailBarang) {
      const product = await Product.findById(item.produk);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Produk tidak ditemukan',
        });
      }

      const jumlah = Number(item.jumlah);

      if (!Number.isInteger(jumlah) || jumlah < 1) {
        return res.status(400).json({
          success: false,
          message: 'Jumlah produk harus berupa angka minimal 1',
        });
      }

      const hargaSatuan = product.hargaJual;
      const subtotal = jumlah * hargaSatuan;

      calculatedDetailBarang.push({
        produk: product._id,
        jumlah,
        hargaSatuan,
        subtotal,
      });
    }

    const totalHarga = calculatedDetailBarang.reduce(
      (total, item) => total + item.subtotal,
      0
    );

    const transaction = await Transaction.create({
      ...req.body,
      kasir: req.user?._id || req.body.kasir,
      detailBarang: calculatedDetailBarang,
      totalHarga,
    });

    res.status(201).json({
      success: true,
      message: 'Transaksi berhasil dibuat',
      data: transaction,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Gagal membuat transaksi',
      error: error.message,
    });
  }
};

// PATCH /api/transactions/:id/cancel
exports.cancelTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findByIdAndUpdate(
      req.params.id,
      { status: 'batal' },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaksi tidak ditemukan',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Transaksi berhasil dibatalkan',
      data: transaction,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Gagal membatalkan transaksi',
      error: error.message,
    });
  }
};
