const Product = require('../models/Product');

// GET /api/products
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil data produk',
      error: error.message,
    });
  }
};

// GET /api/products/:id
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Produk tidak ditemukan',
      });
    }

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'ID produk tidak valid',
    });
  }
};

// POST /api/products
exports.createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Produk berhasil ditambahkan',
      data: product,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Gagal menambahkan produk',
      error: error.message,
    });
  }
};

// PUT /api/products/:id
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Produk tidak ditemukan',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Produk berhasil diperbarui',
      data: product,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Gagal memperbarui produk',
      error: error.message,
    });
  }
};

// DELETE /api/products/:id
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Produk tidak ditemukan',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Produk berhasil dihapus',
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'ID produk tidak valid',
    });
  }
};