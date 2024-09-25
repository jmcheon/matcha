// routes/accountRoutes.ts
import express from 'express';
import { generateProfile } from '../controllers/profile.controller';
import AccountController from '../controllers/account.controller';

const router = express.Router();

// Define the route to get account by ID
router.get('/account/:id', AccountController.getAccountById);
router.post('/profile', generateProfile);
router.patch('/account/:id', AccountController.updateUser);

export default router;
