import express from 'express';

import { searchStocks } from '../controllers/stockSearch.controller';

const router = express.Router();

router.get('/api/stocks/search', searchStocks);

export default router;