import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

class EmailService {
  public transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.GMAIL_ID,
        pass: process.env.GMAIL_PASSWORD,
      },
    });
  }

  async sendVerifyEmail(
    data: { id: number; email: string },
    lang: 'en' | 'fr'
  ) {
    console.log(process.env.GMAIL_ID)
    console.log(process.env.GMAIL_PASSWORD)
    try {
      console.log(data)
      const token = jwt.sign(
        //TODO: account_id
        { userId: data.id },
        process.env.JWT_SECRET as string, // Ensure JWT_SECRET is set in .env
        { expiresIn: '24h' }
      );

      const template = {
        en: {
          subject: 'Verify your email',
          html: `<a href="${process.env.BACK_HOST}/verify-email?token=${token}&lang=${lang}">Verify your email</a>`,
        },
        fr: {
          subject: 'Verifier votre email',
          html: `<a href="${process.env.BACK_HOST}/verify-email?token=${token}&lang=${lang}">Verifier votre email</a>`,
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
      console.log('Email sent to ' + data.email);
      console.log(template[lang].html);
    } catch (error) {
      console.error('Error sending email:', error);
      throw new Error("Can't send email");
    }
  }
}

export default EmailService;
