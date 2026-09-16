const mongoose = require('mongoose');

const transactionItemSchema = new mongoose.Schema(
    {
        produk: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: [true, 'Produk harus diisi'],
        },
        jumlah: {
            type: Number,
            required: [true, 'Jumlah produk harus diisi'],
            min: [1, 'Jumlah produk minimal 1'],
        },
        hargaSatuan: {
            type: Number,
            required: [true, 'Harga satuan harus diisi'],
            min: [0, 'Harga satuan tidak boleh kurang dari 0'],
        },
        subtotal: {
            type: Number,
            required: [true, 'Subtotal harus diisi'],
            min: [0, 'Subtotal tidak boleh kurang dari 0'],
        },
    },
    {
        _id: false,
    }
);

const transactionSchema = new mongoose.Schema(
    {
        kasir: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'Kasir harus diisi'],
        },
        detailBarang: {
            type: [transactionItemSchema],
            required: [true, 'Detail barang harus diisi'],
            validate: {
                validator(value) {
                    return value.length > 0;
                },
                message: 'Detail barang minimal berisi 1 produk',
            },
        },
        totalHarga: {
            type: Number,
            required: [true, 'Total harga harus diisi'],
            min: [0, 'Total harga tidak boleh kurang dari 0'],
        },
        status: {
            type: String,
            enum: ['selesai', 'batal'],
            default: 'selesai',
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Transaction', transactionSchema);
