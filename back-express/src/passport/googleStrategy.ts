import passport from 'passport';

import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { pool } from '../utils/db';
import { ResultSetHeader, RowDataPacket } from 'mysql2';
import { Account } from '../models/account.model';
import { SocialInfo } from './SocialInfo';

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
          console.log("checker", accessToken, refreshToken)
          const googleId = profile.id;
          const email = profile.emails?.[0]?.value as string;

          const socialInfoGoogle: SocialInfo = {
            id: googleId,
            email: email,
            provider: 'google'
          }


          const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM account WHERE google_id = ?', [googleId]);
          let account = rows[0] as Account | undefined;

          // // If an account with the same email exists but the Google ID does not
          // if (account?.email === email && (!account?.google_id || account.google_id === "" || account?.google_id !== googleId)) {
          //   // Redirect to an account linking page
          //   return done(null, false, { code: 'GOOGLE_NOT_LINKED' });
          // }

          if (account && account.username) {
            return done(null, account);
          }

          if (!account) {
            const [result] = await pool.query<ResultSetHeader>('INSERT INTO account (google_id, status, google_access_token, google_refresh_token) VALUES (?, ?, ?, ?)', [googleId, 'incomplete_social', accessToken, refreshToken]);

            account = { account_id: result.insertId, status: 'incomplete_social', google_id: googleId, created_at: new Date() }; // Return newly created account
          }

          return done(null, socialInfoGoogle); // Successful authentication
        } catch (error) {
          return done(error);
        }
      }
    )
  );
}
