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
          const googleId = profile.id;
          const email = profile.emails?.[0]?.value;


          const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM account WHERE google_id = ?', [googleId]);
          let account = rows[0] as Account | undefined;

          // If an account with the same email exists but the Google ID does not
          if (account?.email === email && (!account?.google_id || account.google_id === "")) {
            // Redirect to an account linking page
            return done(null, false, { code: 'GOOGLE_NOT_LINKED' });
          }

          // If account exists with Google ID, return success
          if (account && account.google_id === googleId) {
            return done(null, account);
          }

          // If account does not exist, create a new account
          if (!account) {
            const [result] = await pool.query<ResultSetHeader>('INSERT INTO account (email, google_id, status) VALUES (?, ?, ?)', [email, googleId, 'incomplete_social']);
            account = { account_id: result.insertId, email, status: 'incomplete_social', google_id: googleId, created_at: new Date() }; // Return newly created account
          }

          return done(null, account); // Successful authentication
        } catch (error) {
          return done(error);
        }
      }
    )
  );
}
