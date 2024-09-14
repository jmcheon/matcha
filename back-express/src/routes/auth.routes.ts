// routes/accountRoutes.ts
import express from 'express';
import AuthentificationController from '../controllers/auth.controller';
import { isNotLoggedIn } from '../middleware/authGuard';

const router = express.Router();

// Define the route to get account by ID
router.post('/register', AuthentificationController.register);
router.post('/social-register', AuthentificationController.registerAfterSocialLogin);
router.post('/login', isNotLoggedIn, AuthentificationController.login);
router.delete('/logout', AuthentificationController.logout);
router.post('/refresh', AuthentificationController.refresh);
router.get('/verify-email', AuthentificationController.verifyEmail);
router.get('/google', AuthentificationController.googleLogin);

router.get('/auth/google/callback', AuthentificationController.googleCallback);

export default router;
