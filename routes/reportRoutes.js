const express = require('express');

const {
    getSummary,
    getRevenue,
    getTopProducts
} = require('../controllers/reportController');

const router = express.Router();

router.get('/summary', getSummary);
router.get('/revenue', getRevenue);
router.get('/top-products', getTopProducts);

module.exports = router;