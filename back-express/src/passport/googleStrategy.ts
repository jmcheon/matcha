import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { pool } from '../utils/db';
import { ResultSetHeader, RowDataPacket } from 'mysql2';
import { Account } from '../models/account.model';

export default function google() {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID as string,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        callbackURL: 'http://localhost:3005/auth/google/callback', // Adjust the callback URL
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          console.log("testing", profile)
          const googleId = profile.id;
          const email = profile.emails?.[0]?.value;

          if (!email) {
            return done(null, false, { message: 'No email found in Google account.' });
          }

          const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM account WHERE email = ?', [email]);
          let account = rows[0] as Account | undefined;

          if (!account) {
            // If account does not exist, create a new account
            const [result] = await pool.query<ResultSetHeader>('INSERT INTO account (email, google_id, status) VALUES (?, ?, ?)', [email, googleId, 'incomplete_profile']);
            account = { account_id: result.insertId, email, status: 'incomplete_profile', google_id: googleId, created_at: new Date() }; // Return newly created account
          }

          return done(null, account); // Successful authentication
        } catch (error) {
          return done(error);
        }
      }
    )
  );
}
