// routes/accountRoutes.ts
import express from 'express';
import { getAccountByIdController } from '../controllers/account.controller';

const router = express.Router();

// Define the route to get account by ID
router.get('/account/:id', getAccountByIdController);

export default router;
