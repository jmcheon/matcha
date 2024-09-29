// routes/accountRoutes.ts
import express from 'express';
import ProfileController from '../controllers/profile.controller';
import AccountController from '../controllers/account.controller';

const router = express.Router();

// Define the route to get account by ID
router.get('/', ProfileController.getProfile);
router.post('/', ProfileController.generateProfile);
router.patch('/:id', AccountController.updateUser);
router.post('/upload_image', ProfileController.uploadPicture);
router.get('/social_image', ProfileController.githubGetProfileImage);

export default router;
