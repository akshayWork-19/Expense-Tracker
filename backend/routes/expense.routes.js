/*
import User from '../models/user.models.js';
now we've used auth-middleware to get userId
*/
import express from 'express';
import auth from '../middleware/auth.middleware.js';
import { allExpenses, createExpense, deleteExpense, exportAsCSV, updateExpense, getSummary, getMonthlyTrends, getExpenseByDateRange, bulkDelete, getBudgetOverview, getCategoryBreakdown } from '../controllers/expense.controller.js';
import { catchAsync } from '../middleware/error.middleware.js';
import { authorizeRoles } from '../middleware/role.middleware.js';

const router = express.Router();
router.use(auth);


router.get('/getSummary', authorizeRoles('Admin', 'Analyst'), catchAsync(getSummary));
router.get('/getCategoryBreakdown', authorizeRoles('Admin', 'Analyst'), catchAsync(getCategoryBreakdown));
router.get('/getMonthlyTrends', authorizeRoles('Admin', 'Analyst'), catchAsync(getMonthlyTrends));
router.get("/export/csv", authorizeRoles('Admin', 'Analyst'), catchAsync(exportAsCSV));

router.post('/create', authorizeRoles('Admin'), catchAsync(createExpense));
router.put('/:id', authorizeRoles('Admin'), catchAsync(updateExpense));
router.delete('/:id', authorizeRoles('Admin'), catchAsync(deleteExpense));
router.post('/bulk-delete', authorizeRoles('Admin'), catchAsync(bulkDelete));


router.get('/allExpenses', authorizeRoles('Viewer', 'Admin', 'Analyst'), catchAsync(allExpenses));



export default router;