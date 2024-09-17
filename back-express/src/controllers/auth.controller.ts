import { CookieOptions, NextFunction, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import {
  Account,
  checkIfEmailExists,
  checkIfUsernameExists,
  createAccount,
  getAccountByEmail,
  getAccountById,
  getAccountStatus,
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
import { JwtPayloadModel } from '../models/payload.model';
import { access } from 'fs';

export default class AuthenticationController {
  // Helper function to generate tokens, set cookies, and save refresh token
  static async generateTokensAndSetCookies(
    res: Response,
    userId: number
  ): Promise<string> {
    try {
      const { accessToken, ...accessOption } = getCookieWithJwtAccessToken(userId);
      const { refreshToken, ...refreshOption } = getCookieWithJwtRefreshToken(userId);

      res.cookie('accessToken', accessToken, accessOption as CookieOptions);
      res.cookie('refreshToken', refreshToken, refreshOption as CookieOptions);

      await saveRefreshToken(userId, refreshToken);

      return accessToken;
    } catch (error) {
      throw error;
    }
  }

  static async register(req: Request, res: Response) {
    const { username, email, password } = req.body;
    const { lang } = req.query;

    if (!username || !email || !password) {
      return res.status(400).json({ code: 'All fields are required' });
    }

    try {
      const selectedLang: 'en' | 'fr' = lang === 'fr' ? 'fr' : 'en';

      const usernameExists = await checkIfUsernameExists(username);
      if (usernameExists) {
        return res.status(409).json({ code: 'USERNAME_ALREADY_EXISTS' });
      }


      // Check if email is already in use
      const emailExists = await checkIfEmailExists(email);
      if (emailExists) {
        return res.status(409).json({ code: 'EMAIL_ALREADY_EXISTS' });
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create a new account
      const accountId = await createAccount(username, email, hashedPassword, 'pending_verification');

      const createdUser = {
        accountId: accountId,
        username,
        email,
      };

      // Use the helper function to generate tokens and set cookies
      const accessToken = await AuthenticationController.generateTokensAndSetCookies(res, accountId);

      // Send verification email
      await EmailService.sendVerifyEmail(createdUser, selectedLang);

      // Respond with success
      return res.status(201).json({
        ...createdUser,
        accessToken,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ code: 'GENERAL_ERROR' });
    }
  }

  static async registerAfterSocialLogin(req: Request, res: Response) {
    const { username, email, password } = req.body;
    const { lang } = req.query;

    if (!username || !email || !password) {
      return res.status(400).json({ code: 'Email is required' });
    }

    try {
      const selectedLang: 'en' | 'fr' = lang === 'fr' ? 'fr' : 'en';

      const usernameExists = await checkIfUsernameExists(username);
      if (usernameExists) {
        return res.status(409).json({ code: 'USERNAME_ALREADY_EXISTS' });
      }

      const existingUser = await getAccountByEmail(email);
      if (!existingUser) {
        return res.status(409).json({ error: 'No account associated with this email' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      await updateAccountStatus(existingUser.account_id, 'pending_verification');
      await pool.query(
        'UPDATE account SET username =?, email=?, password = ? WHERE account_id = ?',
        [username, email, hashedPassword, existingUser.account_id]
      );

      const accountId = existingUser.account_id;
      const createdUser = {
        accountId: accountId,
        username,
        email,
      };

      // Use the helper function to generate tokens and set cookies
      const accessToken = await AuthenticationController.generateTokensAndSetCookies(res, accountId);

      // Send verification email
      await EmailService.sendVerifyEmail(createdUser, selectedLang);

      return res.status(201).json({
        ...createdUser,
        accessToken,
      });
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  }


  static login(req: Request, res: Response, next: NextFunction) {
    passport.authenticate('local', async (err: any, account: Account | false, info: { message: string }) => {
      if (err) return next(err);
      if (!account) {
        return res.status(400).json({ code: "INVALID_LOGIN" });
      }

      // Use the helper function to generate tokens and set cookies
      const accessToken = await AuthenticationController.generateTokensAndSetCookies(res, account.account_id);

      // check if the account needs to be verified or not, change to online
      const accountStatus = await getAccountStatus(account.account_id);
      if (accountStatus === "offline")
        await updateAccountStatus(account.account_id, 'online');
      return res.status(200).json({
        ...account,
        accessToken,
      });
    })(req, res, next);
  }

  static async logout(req: Request, res: Response) {
    const cookieOptions = {
      domain: process.env.DOMAIN,
      path: '/',
      httpOnly: true,
      expires: new Date(),
    };

    const accessToken = req.cookies['accessToken'];
    if (!accessToken) return res.status(200).json({ success: 'Logged out' });

    try {
      const payload = jwt.verify(accessToken, process.env.JWT_SECRET as string) as JwtPayloadModel;
      console.log(payload)
      await saveRefreshToken(payload.accountId, '');
      console.log("testing")
      // check if the account needs to be verified or not, change to online
      const accountStatus = await getAccountStatus(payload.accountId);
      console.log("logout", accountStatus)
      if (accountStatus === "online")
        await updateAccountStatus(payload.accountId, 'offline');

      res.cookie('accessToken', '', cookieOptions);
      res.cookie('refreshToken', '', cookieOptions);
    } catch (error) {
      // Token is invalid or expired; proceed with logout
    } finally {
      return res.status(200).json({ success: 'Logged out' });
    }
  }

  static googleLogin(req: Request, res: Response, next: NextFunction) {
    passport.authenticate('google', { scope: ['profile', 'email'] })(req, res, next);
  }

  static googleCallback(req: Request, res: Response, next: NextFunction) {
    const { lang } = req.query;

    const language = ['en', 'fr'].includes(lang as string) ? (lang as string) : 'en';

    passport.authenticate('google', async (err: any, account: Account | false, info: { code: string }) => {
      if (err) return next(err);
      if (!account) {
        if (info?.code) {
          return res.redirect(`${process.env.NGINX_HOST}/${language}/error?message=${encodeURIComponent(info.code)}`);
        }
        return res.redirect(`${process.env.NGINX_HOST}/${language}/error?message=${encodeURIComponent('INVALID_USER_CREDENTIALS')}`);
      }

      if (account.status === 'incomplete_profile') {
        return res.redirect(
          `${process.env.NGINX_HOST}/${language}/auth/register?email=${encodeURIComponent(account.email as string)}&socialLogin=true`
        );
      }

      // Use the helper function to generate tokens and set cookies
      await AuthenticationController.generateTokensAndSetCookies(res, account.account_id);

      if (account.status === 'pending_verification') {
        return res.redirect(`${process.env.NGINX_HOST}/${language}/auth/verify-email`);
      } else {
        return res.redirect(`${process.env.NGINX_HOST}/${language}`);
      }
    })(req, res, next);
  }

  static async refresh(req: Request, res: Response) {
    const oldRefreshToken = req.cookies['refreshToken'];
    if (!oldRefreshToken) {
      return res.status(400).json({ error: 'Refresh token not provided' });
    }
    try {
      const payload = jwt.verify(oldRefreshToken, process.env.JWT_SECRET as string) as JwtPayloadModel;
      const userId = payload.accountId;

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
      const accessToken = await AuthenticationController.generateTokensAndSetCookies(res, userId);

      // Retrieve user data to return
      const userData = await getAccountById(userId);
      console.log(userData)

      // Return user data along with the access token
      return res.json({ ...userData, accessToken });
    } catch (error) {
      return res.status(401).json({ error: 'Invalid or expired refresh token' });
    }
  }

  static async forgotPassword(req: Request, res: Response) {
    const { email } = req.body;
    const lang = req.query.lang as 'en' | 'fr';

    try {
      const foundAccount = await getAccountByEmail(email);
      if (!foundAccount) {
        return res.status(409).json({ code: 'INVALID_EMAIL' });
      }

      await EmailService.sendPasswordResetEmail(
        { accountId: foundAccount.account_id as number, email: foundAccount.email as string },
        lang,
      );
      return res.status(200).json({ code: 'backToHome' });
    } catch (error) {
      return res.status(401).json({ error: 'Invalid or expired refresh token' });
    }
  }

  static async resetPassword(req: Request, res: Response) {
    const { email } = req.body;
    const lang = req.query.lang as 'en' | 'fr';
    const token = req.query.token;

    const payload = jwt.verify(token as string, process.env.JWT_SECRET as string) as JwtPayloadModel;
    console.log(payload)
    await AuthenticationController.generateTokensAndSetCookies(res, payload.accountId);
    return res.redirect(
      `http://localhost:8080/${lang}/auth/reset-password/`
    );
  }
}
