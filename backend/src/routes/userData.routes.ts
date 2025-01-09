import express from 'express';

import {addExpense, addIncome, removeExpense, removeIncome, addUser} from '../controllers/data.controller';

const router = express.Router();

router.post('/api/users/', addUser);
router.post('/api/expenses/:userId', addExpense);
router.delete('/api/expenses/:userId/:expenseId', removeExpense);
router.post('/api/income/:userId', addIncome);
router.delete('/api/income/:userId/:incomeId', removeIncome);

export default router;