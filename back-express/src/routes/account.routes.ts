// routes/accountRoutes.ts
import express from 'express';
import { getAccountByIdController } from '../controllers/account.controller';
import { generateProfile } from '../controllers/profile.controller';

const router = express.Router();

// Define the route to get account by ID
router.get('/account/:id', getAccountByIdController);
router.post('/profile', generateProfile);

export default router;
