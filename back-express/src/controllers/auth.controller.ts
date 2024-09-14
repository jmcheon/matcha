import { CookieOptions, NextFunction, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import {
  Account,
  checkIfEmailExists,
  createAccount,
  getAccountByEmail,
  getAccountById,
  updateAccountStatus,
} from '../models/account.model';
import { pool } from '../utils/db'
import EmailService from '../services/email.service';
import {
  getCookieWithJwtAccessToken,
  getCookieWithJwtRefreshToken,
  saveRefreshToken,
} from '../services/auth.service';
import jwt from 'jsonwebtoken';
import passport from 'passport';

interface JwtPayload {
  userId: number;
}

export default class AuthenticationController {
  // Helper function to generate tokens, set cookies, and save refresh token
  static async generateTokensAndSetCookies(
    res: Response,
    userId: number
  ): Promise<string> {
    console.log('Entered generateTokensAndSetCookies with userId:', userId);
    try {
      const { accessToken, ...accessOption } = getCookieWithJwtAccessToken(userId);
      const { refreshToken, ...refreshOption } = getCookieWithJwtRefreshToken(userId);

      res.cookie('accessToken', accessToken, accessOption as CookieOptions);
      res.cookie('refreshToken', refreshToken, refreshOption as CookieOptions);

      await saveRefreshToken(userId, refreshToken);

      console.log('Exiting generateTokensAndSetCookies');

      return accessToken;
    } catch (error) {
      console.log('Error in generateTokensAndSetCookies:', error);
      throw error; // Re-throw the error to be caught in the calling method
    }
  }

  static async register(req: Request, res: Response) {
    const { email, password } = req.body;
    const { lang } = req.query;

    if (!email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    try {
      const selectedLang: 'en' | 'fr' = lang === 'fr' ? 'fr' : 'en';

      // Check if email is already in use
      const emailExists = await checkIfEmailExists(email);
      if (emailExists) {
        return res.status(409).json({ error: 'Email is already in use' });
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create a new account
      const userId = await createAccount(email, hashedPassword, 'pending_verification');

      const createdUser = {
        id: userId,
        email,
      };

      // Use the helper function to generate tokens and set cookies
      const accessToken = await AuthenticationController.generateTokensAndSetCookies(res, userId);

      // Send verification email
      const emailService = new EmailService();
      await emailService.sendVerifyEmail({ id: userId, email }, selectedLang);

      // Respond with success
      return res.status(201).json({
        ...createdUser,
        accessToken,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server error' });
    }
  }

  static async registerAfterSocialLogin(req: Request, res: Response) {
    const { email, password } = req.body;
    const { lang } = req.query;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }


    try {
      const selectedLang: 'en' | 'fr' = lang === 'fr' ? 'fr' : 'en';
      console.log("error1")
      const existingUser = await getAccountByEmail(email);
      if (!existingUser) {
        return res.status(404).json({ error: 'No account associated with this email' });
      }
      console.log("error2")

      if (password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        await updateAccountStatus(existingUser.account_id, 'pending_verification');
        await pool.query(
          'UPDATE account SET password = ? WHERE account_id = ?',
          [hashedPassword, existingUser.account_id]
        );
      }

      console.log("error3")
      const userId = existingUser.account_id;
      const createdUser = {
        id: userId,
        email,
      };

      // Use the helper function to generate tokens and set cookies
      const accessToken = await AuthenticationController.generateTokensAndSetCookies(res, userId);

      console.log("error4")
      // Send verification email
      const emailService = new EmailService();
      await emailService.sendVerifyEmail({ id: userId, email }, selectedLang);

      console.log("error5")
      return res.status(201).json({
        ...createdUser,
        accessToken,
      });
    } catch (error) {
      console.log("errorrrrr", error)
      res.status(500).json({ error: 'Server error' });
    }
  }

  static async verifyEmail(req: Request, res: Response) {
    const { token, lang } = req.query;

    const language = ['en', 'fr'].includes(lang as string) ? (lang as string) : 'en';

    try {
      if (!token) {
        return res.status(400).json({ error: 'Token is required' });
      }

      // Verify the token
      const payload = jwt.verify(token as string, process.env.JWT_SECRET as string) as JwtPayload;

      // Handle user verification here
      const user = await getAccountById(payload.userId);
      if (!user) {
        throw new Error('User not found');
      }

      await updateAccountStatus(user.account_id, 'incomplete_profile');

      // Redirect to the confirmation page
      res.redirect(`${process.env.FRONT_HOST}/${language}/auth/generate-profile`);
    } catch (err) {
      // Handle token verification errors
      return res.status(400).json({ error: 'Invalid or expired token' });
    }
  }

  static login(req: Request, res: Response, next: NextFunction) {
    passport.authenticate('local', async (err: any, account: Account | false, info: { message: string }) => {
      if (err) return next(err);
      if (!account) {
        return res.status(400).json({ error: info.message });
      }

      // Use the helper function to generate tokens and set cookies
      const accessToken = await AuthenticationController.generateTokensAndSetCookies(res, account.account_id);

      return res.status(200).json({
        ...account,
        accessToken,
      });
    })(req, res, next);
  }

  static googleLogin(req: Request, res: Response, next: NextFunction) {
    passport.authenticate('google', { scope: ['profile', 'email'] })(req, res, next);
  }

  static googleCallback(req: Request, res: Response, next: NextFunction) {
    const { lang } = req.query;

    const language = ['en', 'fr'].includes(lang as string) ? (lang as string) : 'en';

    passport.authenticate('google', async (err: any, account: Account | false, info: { message: string }) => {
      if (err) return next(err);
      if (!account) {
        return res.status(400).json({ error: info?.message || 'Google login failed' });
      }

      if (account.status === 'incomplete_profile') {
        return res.redirect(
          `http://localhost:8080/${language}/auth/register?email=${encodeURIComponent(account.email as string)}&socialLogin=true`
        );
      }

      // Use the helper function to generate tokens and set cookies
      await AuthenticationController.generateTokensAndSetCookies(res, account.account_id);

      if (account.status === 'pending_verification') {
        return res.redirect(`http://localhost:8080/${language}/auth/verify-email`);
      } else {
        return res.redirect(`http://localhost:8080/${language}`);
      }
    })(req, res, next);
  }

  static async refresh(req: Request, res: Response) {
    const oldRefreshToken = req.cookies['refreshToken'];
    if (!oldRefreshToken) {
      return res.status(400).json({ error: 'Refresh token not provided' });
    }
    try {
      const payload = jwt.verify(oldRefreshToken, process.env.JWT_SECRET as string) as JwtPayload;
      const userId = payload.userId;

      if (!userId) {
        throw new Error('User not found');
      }

      // Invalidate old tokens
      const cookieOptions = {
        domain: process.env.DOMAIN,
        path: '/',
        httpOnly: true,
        expires: new Date(),
      };
      res.cookie('accessToken', '', cookieOptions);
      res.cookie('refreshToken', '', cookieOptions);

      // Generate new tokens and set cookies
      const accessToken = await this.generateTokensAndSetCookies(res, userId);

      // Retrieve user data to return
      const userData = await getAccountById(userId);

      // Return user data along with the access token
      return res.json({ ...userData, accessToken });
    } catch (error) {
      return res.status(401).json({ error: 'Invalid or expired refresh token' });
    }
  }

  static async logout(req: Request, res: Response) {
    const cookieOptions = {
      domain: process.env.DOMAIN,
      path: '/',
      httpOnly: true,
      expires: new Date(),
    };

    res.cookie('accessToken', '', cookieOptions);
    res.cookie('refreshToken', '', cookieOptions);

    const accessToken = req.cookies['accessToken'];
    if (!accessToken) return res.status(200).json({ success: 'Logged out' });
    try {
      const payload = jwt.verify(accessToken, process.env.JWT_SECRET as string) as JwtPayload;
      await saveRefreshToken(payload.userId, '');
    } catch (error) {
      // Token is invalid or expired; proceed with logout
    }
    return res.status(200).json({ success: 'Logged out' });
  }
}
