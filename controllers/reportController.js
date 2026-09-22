const Transaction = require('../models/Transaction');
const Product = require('../models/Product');

const getSummary = async (req, res) => {
    try {
        const totalProduk = await Product.countDocuments();

        const totalTransaksi = await Transaction.countDocuments({
            status: 'selesai'
        });

        const hasilOmzet = await Transaction.aggregate([
            {
                $match: {
                    status: 'selesai'
                }
            },
            {
                $group: {
                    _id: null,
                    totalOmzet: {
                        $sum: '$totalHarga'
                    }
                }
            }
        ]);

        const totalOmzet =
            hasilOmzet.length > 0
                ? hasilOmzet[0].totalOmzet
                : 0;

        res.status(200).json({
            success: true,
            data: {
                totalProduk,
                totalTransaksi,
                totalOmzet
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Gagal mengambil ringkasan laporan',
            error: error.message
        });
    }
};

const getRevenue = async (req, res) => {
    try {
        const hasil = await Transaction.aggregate([
            {
                $match: {
                    status: 'selesai'
                }
            },
            {
                $group: {
                    _id: {
                        $dateToString: {
                            format: '%Y-%m-%d',
                            date: '$createdAt'
                        }
                    },
                    omzet: {
                        $sum: '$totalHarga'
                    },
                    jumlahTransaksi: {
                        $sum: 1
                    }
                }
            },
            {
                $sort: {
                    _id: 1
                }
            }
        ]);

        const data = hasil.map((item) => ({
            tanggal: item._id,
            omzet: item.omzet,
            jumlahTransaksi: item.jumlahTransaksi
        }));

        res.status(200).json({
            success: true,
            data
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Gagal mengambil laporan omzet',
            error: error.message
        });
    }
};

const getTopProducts = async (req, res) => {
    try {
        res.status(200).json({
            success: true,
            data: []
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Gagal mengambil produk terlaris',
            error: error.message
        });
    }
};

module.exports = {
    getSummary,
    getRevenue,
    getTopProducts
};