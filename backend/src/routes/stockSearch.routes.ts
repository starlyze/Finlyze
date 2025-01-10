import express from 'express';

import { searchStocks, getStockData } from '../controllers/stockSearch.controller';

const router = express.Router();

router.get('/api/stocks/search', searchStocks);
router.get('/api/stocks/data', getStockData);

export default router;
