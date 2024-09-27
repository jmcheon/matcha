import passport from 'passport';
import OAuth2Strategy from 'passport-oauth2'
import { pool } from '../utils/db';
import { ResultSetHeader, RowDataPacket } from 'mysql2';
import { Account } from '../models/account.model';
import axios from 'axios';
import { SocialInfo } from './SocialInfo';

// Extend the OAuth2Strategy
class FortyTwoStrategy extends OAuth2Strategy {
  constructor(options: any, verify: any) {
    super(options, verify);
    this.name = '42';
  }

  // Implement the userProfile method
  userProfile(accessToken: string, done: any) {
    axios
      .get('https://api.intra.42.fr/v2/me', {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      .then((response) => {
        const profile = response.data;
        profile.provider = '42';
        done(null, profile);
      })
      .catch((error) => {
        done(error);
      });
  }
}

export default function ft() {
  const ftStrategy = new FortyTwoStrategy(
    {
      authorizationURL: 'https://api.intra.42.fr/oauth/authorize',
      tokenURL: 'https://api.intra.42.fr/oauth/token',
      clientID: process.env.FT_CLIENT_ID as string,
      clientSecret: process.env.FT_CLIENT_SECRET as string,
      callbackURL: 'http://localhost:3005/auth/ft/callback',
    },
    async (accessToken: string, refreshToken: string, profile: any, done: any) => {
      try {
        // will use later DO NOT REMOVE
        // back-express  | User Profile: [
        //   back-express  |   'id',               'email',             'login',
        //   back-express  |   'first_name',       'last_name',         'usual_full_name',
        //   back-express  |   'usual_first_name', 'url',               'phone',
        //   back-express  |   'displayname',      'kind',              'image',
        //   back-express  |   'staff?',           'correction_point',  'pool_month',
        //   back-express  |   'pool_year',        'location',          'wallet',
        //   back-express  |   'anonymize_date',   'data_erasure_date', 'created_at',
        //   back-express  |   'updated_at',       'alumnized_at',      'alumni?',
        //   back-express  |   'active?',          'groups',            'cursus_users',
        //   back-express  |   'projects_users',   'languages_users',   'achievements',
        //   back-express  |   'titles',           'titles_users',      'partnerships',
        //   back-express  |   'patroned',         'patroning',         'expertises_users',
        //   back-express  |   'roles',            'campus',            'campus_users',
        //   back-express  |   'provider'
        //   back-express  | ]
        const intraLogin = profile.login;
        const email = profile.email

        const socialInfo42: SocialInfo = {
          id: intraLogin,
          email: email,
          provider: '42'
        }

        const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM account WHERE intra_username = ?', [profile.login]);

        let account = rows[0] as Account | undefined;

        // If an account with the same email exists but the Google ID does not
        if (account?.email === email && (!account?.intra_username || account.intra_username === "" || account?.intra_username !== intraLogin)) {
          // Redirect to an account linking page
          return done(null, false, { code: '42INTRA_NOT_LINKED' });
        }

        // If account exists with Google ID, return success
        if (account && account.username) {
          return done(null, account);
        }

        // If account does not exist, create a new account
        if (!account) {
          const [result] = await pool.query<ResultSetHeader>('INSERT INTO account (intra_username, status) VALUES (?, ?)', [intraLogin, 'incomplete_social']);
          account = { account_id: result.insertId, status: 'incomplete_social', intra_username: intraLogin, created_at: new Date() }; // Return newly created account
        }

        return done(null, socialInfo42); // Successful authentication
      } catch (error) {
        return done(error);
      }
    }
  );

  passport.use(ftStrategy);
}

