import passport from 'passport';
import { Strategy as GitHubStrategy } from 'passport-github2';
import { pool } from '../utils/db';
import { ResultSetHeader, RowDataPacket } from 'mysql2';
import { Account } from '../models/account.model';
import { SocialInfo } from './SocialInfo';

export default function github() {
  passport.use(
    new GitHubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID as string,
        clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
        callbackURL: 'http://localhost:3005/auth/github/callback', // Adjust the callback URL
      },
      async (accessToken: string, refreshToken: string, profile: any, done: any) => {
        try {

          console.log("testing", profile.id, profile.email)
          const githubId = profile.id;
          const email = profile.email;

          const socialInfoGitHub: SocialInfo = {
            id: githubId,
            email: email,
            provider: 'github'
          }


          const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM account WHERE github_id = ?', [githubId]);
          let account = rows[0] as Account | undefined;

          // // If an account with the same email exists but the Google ID does not
          // if ((account?.email && account?.email === email) && (!account?.github_id || account.github_id === "" || account?.github_id !== githubId)) {
          //   // Redirect to an account linking page
          //   return done(null, false, { code: 'GITHUB_NOT_LINKED' });
          // }

          if (account && account.username) {
            return done(null, account);
          }

          if (!account) {
            const [result] = await pool.query<ResultSetHeader>('INSERT INTO account  (github_id, status) VALUES (?, ?)', [githubId, 'incomplete_social']);
            account = { account_id: result.insertId, status: 'incomplete_social', github_id: githubId, created_at: new Date() }; // Return newly created account
          }

          return done(null, socialInfoGitHub); // Successful authentication
        } catch (error) {
          return done(error);
        }
      }
    )
  );
}
