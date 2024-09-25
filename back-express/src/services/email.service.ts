import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { getAccountById, updateAccountStatus } from '../models/account.model';
import { JwtPayloadModel } from '../models/payload.model';
class EmailService {

  public static transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.GMAIL_ID,
      pass: process.env.GMAIL_PASSWORD,
    },
  });

  static async sendVerifyEmail(
    data: { accountId: number; username: string; email: string },
    lang: 'en' | 'fr'
  ) {
    try {
      const token = jwt.sign(
        //TODO: account_id
        data,
        process.env.JWT_SECRET as string, // Ensure JWT_SECRET is set in .env
        { expiresIn: '24h' }
      );

      const template = {
        en: {
          subject: '[Matcha-reloaded] Verify your email',
          html: `<a href="${process.env.BACK_HOST}/verify-email?token=${token}&lang=${lang}">Verify your email for username: ${data.username}</a>`,
        },
        fr: {
          subject: '[Matcha-reloaded] Verifier votre email',
          html: `<a href="${process.env.BACK_HOST}/verify-email?token=${token}&lang=${lang}">Verifier votre email pour vorte username: ${data.username}</a>`,
        },
      };

      const mailOptions = {
        from: {
          name: 'Matcha Reloaded',
          address: process.env.GMAIL_ID || 'matcha.reloaded@gmail.com',
        },
        to: data.email,
        subject: template[lang].subject,
        html: template[lang].html,
      };
      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      throw new Error("Can't send email");
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
      const payload = jwt.verify(token as string, process.env.JWT_SECRET as string) as JwtPayloadModel;

      console.log(payload)
      // Handle user verification here
      const user = await getAccountById(payload.accountId);
      if (!user) {
        throw new Error('User not found');
      }

      await updateAccountStatus(user.account_id, 'incomplete_profile');

      // Redirect to the confirmation page
      res.redirect(`${process.env.NGINX_HOST}/${language}/auth/generate-profile`);
    } catch (err) {
      // Handle token verification errors
      return res.status(400).json({ error: 'Invalid or expired token' });
    }
  }

  static async sendPasswordResetEmail(
    data: { accountId: number; email: string },
    lang: 'en' | 'fr'
  ) {
    try {
      const token = jwt.sign(
        data,
        process.env.JWT_SECRET as string, // Ensure JWT_SECRET is set in .env
        { expiresIn: '24h' }
      );
      const template = {
        en: {
          subject: 'Password reset for Matcha',
          html: `<a href="${process.env.BACK_HOST}/reset-password?token=${token}&lang=${lang}">Password reset for Matcha</a>`,
        },
        fr: {
          subject: 'Réinitialisation du mot de passe pour Matcha',
          html: `<a href="${process.env.BACK_HOST}/reset-password?token=${token}&lang=${lang}">Réinitialisation du mot de passe pour Matcha</a>`,
        },
      };
      const mailOptions = {
        from: {
          name: 'Matcha Reloaded',
          address: process.env.GMAIL_ID || 'matcha.reloaded@gmail.com',
        },
        to: data.email,
        subject: template[lang].subject,
        html: template[lang].html,
      };
      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      throw new Error("Can't send email");
    }
  }
}

export default EmailService;
