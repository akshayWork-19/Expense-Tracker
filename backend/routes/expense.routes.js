/*
import User from '../models/user.models.js';
now we've used auth-middleware to get userId
*/
import express from 'express';
import auth from '../middleware/auth.middleware.js';
import { allExpenses, createExpense, deleteExpense, exportAsCSV, updateExpense } from '../controllers/expense.controller.js';
import { catchAsync } from '../middleware/error.middleware.js';

const router = express.Router();
router.use(auth);

router.get("/export/csv",catchAsync(exportAsCSV));

router.post('/create', catchAsync(createExpense));
router.get('/allExpenses', catchAsync(allExpenses));
router.put('/:id', catchAsync(updateExpense));
router.delete('/:id', catchAsync(deleteExpense));


export default router;