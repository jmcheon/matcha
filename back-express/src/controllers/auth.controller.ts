import { CookieOptions, Request, Response } from 'express';
import { pool } from '../utils/db';
import bcrypt from 'bcrypt';
import { Account } from '../models/account.model';
import { FieldPacket, RowDataPacket } from 'mysql2';
import EmailService from '../services/email.service';
import { getAccountById, saveRefreshToken, updateAccountStatus } from '../services/account.service';
import { getCookieWithJwtAccessToken, getCookieWithJwtRefreshToken } from '../services/auth.service'
import jwt from 'jsonwebtoken'

interface JwtPayload {
  userId: number; // Define your payload structure
}


export default class AuthentificationController {

  static async register(req: Request, res: Response) {
    const { email, password } = req.body;
    const { lang } = req.query; // Access query params here

    if (!email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    try {
      // Check if email is already in use
      const selectedLang: 'en' | 'fr' = lang === 'fr' ? 'fr' : 'en'; // Default to 'en' if not 'fr'

      const [existingUser] = await pool.query<RowDataPacket[]>('SELECT email FROM account WHERE email = ?', [email]);

      console.log(existingUser)

      if (existingUser.length > 0) {
        return res.status(409).json({ error: 'Email is already in use' });
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Insert user into the database
      const [result] = await pool.query(
        'INSERT INTO account (email, password, status) VALUES (?, ?, ?)',
        [email, hashedPassword, 'pending_verification']
      );

      const userId = (result as any).insertId; // insertid is from automated generated query

      const createdUser = {
        id: userId,
        email,
      }

      const { accessToken, ...accessOption } =
        getCookieWithJwtAccessToken(userId);
      const { refreshToken, ...refreshOption } =
        getCookieWithJwtRefreshToken(userId);

      res.cookie('accessToken', accessToken, accessOption as CookieOptions);
      res.cookie('refreshToken', refreshToken, refreshOption as CookieOptions);

      await saveRefreshToken(userId, refreshToken)

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

  static async verifyEmail(req: Request, res: Response) {
    let { token, lang } = req.query;

    // Set default language if not provided or unsupported
    const language = ['en', 'fr'].includes(lang as string) ? lang : 'en';

    console.log(token, lang)
    try {
      if (!token) {
        return res.status(400).json({ error: 'Token is required' });
      }

      // Verify the token
      const payload = jwt.verify(token as string, process.env.JWT_SECRET as string) as JwtPayload;

      console.log("check check", payload)
      // Handle user verification here
      const user = await getAccountById(payload.userId);
      if (!user) {
        throw Error("Error")
      }
      console.log("user", user)
      await updateAccountStatus(user.account_id, "incomplete_profile");

      // Redirect to the confirmation page
      res.redirect(`${process.env.FRONT_HOST}/${language}/auth/generate-profile`);
    } catch (err) {
      // Handle token verification errors
      return res.status(400).json({ error: 'Invalid or expired token' });
    }
  }

  static async login(req: Request, res: Response) {
    const { email, password } = req.body;
    console.log(req.body)
    console.log(email, password)
    if (!email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    try {
      const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM account WHERE email = ? LIMIT 1', [email]);

      const account = rows[0]; // Assuming you want the first result (since LIMIT 1)
      console.log(account); // This will log the account details (e.g., email, id, etc.)

      const { accessToken, ...accessOption } =
        getCookieWithJwtAccessToken(account.account_id);
      const { refreshToken, ...refreshOption } =
        getCookieWithJwtRefreshToken(account.account_id);

      res.cookie('accessToken', accessToken, accessOption as CookieOptions);
      res.cookie('refreshToken', refreshToken, refreshOption as CookieOptions);

      await saveRefreshToken(account.account_id, refreshToken)

      return res.status(201).json({
        ...account,
        accessToken,
      });

    }
    catch (e) {
      console.log(e)
    }

  }
  static async socialRegister(req: any, res: Response) {
    try {
      const uinfo = req.body;
      let user_id;

      if (uinfo.provider === 'google') {
        res.json({
          "hello": "world"
        })
      } else throw 'No provider info';

      // const user = await User.me(user_id);
      return res.status(200).json({
        "whats up": "hi"
        // user,
        // access_token: generateToken({ id: user.id }, 'access'),
        // refresh_token: setRefreshToken(res, { id: user.id }),
      });
    } catch (error) {
      console.error(error);
      return res.status(400).json({ error: 'Could not register trough the provider' });
    }
  }
  static async refresh(req: Request, res: Response) {
    let oldRefreshToken = req.cookies['refreshToken'];
    if (!oldRefreshToken) {
      return res.json({ error: 'refresh_token not exist' });
    }
    try {
      const user: any = await jwt.verify(oldRefreshToken, process.env.JWT_SECRET as string);
      console.log("user", user)
      const cookieOptions = {
        domain: process.env.DOMAIN,
        path: '/',
        httpOnly: true,
        expires: new Date(),
      };


      if (!oldRefreshToken) {
        res.cookie('accessToken', '', cookieOptions);
        res.cookie('refreshToken', '', cookieOptions);
        throw new Error('No refresh token');
      }

      const userId = user.userId; // Ensure `req.user` contains the user data
      console.log(req.body)
      if (!userId) {
        throw new Error('User not found');
      }

      // Example of a commented-out section, depending on your actual logic
      // const user = await this.userService.findOneById(userId);
      // if (!user || user.refreshToken !== oldRefreshToken) {
      //   Logger.error('Invalid refresh token');
      //   res.cookie('accessToken', '', cookieOptions);
      //   res.cookie('refreshToken', '', cookieOptions);
      //   throw new UnauthorizedError('Invalid refresh token');
      // }

      // Generate new access and refresh tokens
      const { accessToken, ...accessTokenOptions } = getCookieWithJwtAccessToken(userId);
      const { refreshToken, ...refreshTokenOptions } = getCookieWithJwtRefreshToken(userId);

      // Set the new tokens in cookies
      res.cookie('accessToken', accessToken, accessTokenOptions as CookieOptions);
      res.cookie('refreshToken', refreshToken, refreshTokenOptions as CookieOptions);

      // Update the refresh token in the database
      await saveRefreshToken(userId, refreshToken)

      // Retrieve user data to return
      const userData = await getAccountById(userId);

      // Return user data along with the access token
      return res.json({ ...userData, accessToken });
    } catch (error) {
      return res.status(401).json({ error });
    }
  }
}

