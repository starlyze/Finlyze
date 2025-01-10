import express from 'express';

import {addExpense, addIncome, removeExpense, removeIncome, getTransactions} from '../controllers/userData.controller';

const router = express.Router();

router.post('/api/transactions/expense', addExpense);
router.delete('/api/transactions/expense', removeExpense);
router.post('/api/transactions/income', addIncome);
router.delete('/api/transactions/income', removeIncome);
router.post('/api/transactions', getTransactions); 

export default router;