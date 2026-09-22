const Transaction = require('../models/Transaction');
const Product = require('../models/Product');

const getSummary = async (req, res) => {
    try {
        const { tanggalMulai, tanggalAkhir } = req.query;

        const filterTransaksi = {
            status: 'selesai'
        };

        if (tanggalMulai || tanggalAkhir) {
            filterTransaksi.createdAt = {};

            if (tanggalMulai) {
                filterTransaksi.createdAt.$gte = new Date(tanggalMulai);
            }

            if (tanggalAkhir) {
                const akhir = new Date(tanggalAkhir);
                akhir.setHours(23, 59, 59, 999);

                filterTransaksi.createdAt.$lte = akhir;
            }
        }

        const totalProduk = await Product.countDocuments();

        const totalTransaksi = await Transaction.countDocuments(
            filterTransaksi
        );

        const hasilOmzet = await Transaction.aggregate([
            {
                $match: filterTransaksi
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
        const { tanggalMulai, tanggalAkhir } = req.query;

        const filterTransaksi = {
            status: 'selesai'
        };

        if (tanggalMulai || tanggalAkhir) {
            filterTransaksi.createdAt = {};

            if (tanggalMulai) {
                filterTransaksi.createdAt.$gte = new Date(tanggalMulai);
            }

            if (tanggalAkhir) {
                const akhir = new Date(tanggalAkhir);
                akhir.setHours(23, 59, 59, 999);

                filterTransaksi.createdAt.$lte = akhir;
            }
        }

        const hasil = await Transaction.aggregate([
            {
                $match: filterTransaksi
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
        const { tanggalMulai, tanggalAkhir } = req.query;

        const filterTransaksi = {
            status: 'selesai'
        };

        if (tanggalMulai || tanggalAkhir) {
            filterTransaksi.createdAt = {};

            if (tanggalMulai) {
                filterTransaksi.createdAt.$gte = new Date(tanggalMulai);
            }

            if (tanggalAkhir) {
                const akhir = new Date(tanggalAkhir);
                akhir.setHours(23, 59, 59, 999);

                filterTransaksi.createdAt.$lte = akhir;
            }
        }

        const hasil = await Transaction.aggregate([
            {
                $match: filterTransaksi
            },
            {
                $unwind: '$detailBarang'
            },
            {
                $group: {
                    _id: '$detailBarang.produk',
                    totalTerjual: {
                        $sum: '$detailBarang.jumlah'
                    },
                    totalPendapatan: {
                        $sum: '$detailBarang.subtotal'
                    }
                }
            },
            {
                $sort: {
                    totalTerjual: -1
                }
            },
            {
                $limit: 5
            },
            {
                $lookup: {
                    from: 'products',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'produk'
                }
            },
            {
                $unwind: '$produk'
            },
            {
                $project: {
                    _id: 0,
                    produkId: '$_id',
                    namaProduk: '$produk.nama',
                    totalTerjual: 1,
                    totalPendapatan: 1
                }
            }
        ]);

        res.status(200).json({
            success: true,
            data: hasil
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