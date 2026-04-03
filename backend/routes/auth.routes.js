import express from 'express';
import { changePassword, getAllUsers, login, register, updateProfile, updateUserRoleAndStatus, userProfile } from '../controllers/user.controller.js';
import { catchAsync } from '../middleware/error.middleware.js';
import auth from '../middleware/auth.middleware.js';
import { authorizeRoles } from '../middleware/role.middleware.js';

const router = express.Router();


router.post('/register', catchAsync(register));
router.post('/login', catchAsync(login));
router.get('/profile', auth, catchAsync(userProfile));
router.put('/updateProfile', auth, catchAsync(updateProfile));
router.put('/changePassword', auth, catchAsync(changePassword));
router.get('/users', auth, authorizeRoles('Admin'), catchAsync(getAllUsers));
router.put('/users/:id', auth, authorizeRoles('Admin'), catchAsync(updateUserRoleAndStatus))


export default router;