import express from 'express';
import { getStockStatus } from '../controllers/stockprice.controller.js';

const router = express.Router();

// Get current stock status
router.get('/status', getStockStatus);

export default router;
