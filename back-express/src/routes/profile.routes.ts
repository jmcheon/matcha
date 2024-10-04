// routes/accountRoutes.ts
import express from 'express';
import ProfileController from '../controllers/profile.controller';
import AccountController from '../controllers/account.controller';
import passport from 'passport';
import AuthenticationController from '../controllers/auth.controller';

const router = express.Router();

// Define the route to get account by ID
router.get('/', ProfileController.getProfile);
router.post('/', ProfileController.generateProfile);
router.patch('/:id', AccountController.updateUser);
router.post('/upload_image', ProfileController.uploadPicture);
router.get('/social-image', ProfileController.getSocialProfileImage);
// router.get('/social_image', passport.authenticate('github'), (req, res, next) => {
//   console.log(req.user); // Check if user is populated after authentication
//   ProfileController.githubGetProfileImage(req, res);
// });


export default router;
