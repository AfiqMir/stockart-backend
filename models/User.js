const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        nama: {
            type: String,
            required: [true, 'Nama harus diisi'],
            trim: true,
        },
        username: {
            type: String,
            required: [true, 'Username harus diisi'],
            unique: true,
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
            required: [true, 'Password harus diisi'],
        },
        role: {
            type: String,
            enum: ['pemilik', 'kasir'],
            default: 'kasir',
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('User', userSchema);