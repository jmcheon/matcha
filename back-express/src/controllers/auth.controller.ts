import { Request, Response } from 'express';
import { pool } from '../utils/db';
import bcrypt from 'bcrypt';
import { Account } from '../models/account.model';
import { FieldPacket, RowDataPacket } from 'mysql2';
import EmailService from '../services/email.service';

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
        'INSERT INTO account (email, password) VALUES (?, ?)',
        [email, hashedPassword]
      );

      const userId = (result as any).account_id;

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
