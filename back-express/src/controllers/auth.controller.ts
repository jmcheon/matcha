import { Request, Response } from 'express';
import { pool } from '../utils/db';
import bcrypt from 'bcrypt';
import { Account } from '../models/account.model';
import { FieldPacket, RowDataPacket } from 'mysql2';
import EmailService from '../services/email.service';
import { getAccountById, update } from '../services/account.service';

import jwt from 'jsonwebtoken'

interface JwtPayload {
  userId: number; // Define your payload structure
}


export default class AuthentificationController {

  static async register(req: Request, res: Response) {
    const { firstName, lastName, email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    try {
      // Check if email is already in use
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

      const userId = (result as any).insertId;

      console.log(result, userId);

      // Send verification email
      const emailService = new EmailService();
      const lang = 'en'; // Set the language based on your needs, 'en' or 'fr'

      await emailService.sendVerifyEmail({ id: userId, email }, lang);


      // Respond with success
      res.status(201).json({ message: 'User registered successfully', userId: result });
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
      await update(user.account_id, "incomplete_profile");

      // Redirect to the confirmation page
      res.redirect(`${process.env.FRONT_HOST}/${language}/auth/email-confirmed`);
    } catch (err) {
      // Handle token verification errors
      return res.status(400).json({ error: 'Invalid or expired token' });
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
}
