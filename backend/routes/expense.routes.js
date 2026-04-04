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


router.get('/getSummary', authorizeRoles('Viewer', 'Admin', 'Analyst'), catchAsync(getSummary));
router.get('/getCategoryBreakdown', authorizeRoles('Viewer', 'Admin', 'Analyst'), catchAsync(getCategoryBreakdown));
router.get('/getMonthlyTrends', authorizeRoles('Viewer', 'Admin', 'Analyst'), catchAsync(getMonthlyTrends));
router.get("/export/csv", authorizeRoles('Viewer', 'Admin', 'Analyst'), catchAsync(exportAsCSV));
router.get('/getBudgetOverview', authorizeRoles('Admin', 'Analyst', 'Viewer'), catchAsync(getBudgetOverview)); // Add missing route


router.post('/create', authorizeRoles('Viewer', 'Admin', 'Analyst'), catchAsync(createExpense));
router.put('/:id', authorizeRoles('Viewer', 'Admin', 'Analyst'), catchAsync(updateExpense));
router.delete('/:id', authorizeRoles('Viewer', 'Admin', 'Analyst'), catchAsync(deleteExpense));
router.post('/bulk-delete', authorizeRoles('Viewer', 'Admin', 'Analyst'), catchAsync(bulkDelete));



router.get('/allExpenses', authorizeRoles('Viewer', 'Admin', 'Analyst'), catchAsync(allExpenses));



export default router;