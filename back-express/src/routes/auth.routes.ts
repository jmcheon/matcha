// routes/accountRoutes.ts
import express from 'express';
import AuthentificationController from '../controllers/auth.controller';

const router = express.Router();

// Define the route to get account by ID
router.get('/social', AuthentificationController.socialRegister);
router.post('/register', AuthentificationController.register);
router.post('/login', AuthentificationController.login);
router.delete('/logout', AuthentificationController.logout);
router.post('/refresh', AuthentificationController.refresh);
router.get('/verify-email', AuthentificationController.verifyEmail);

export default router;
