import passport from 'passport'
import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcrypt';
import { pool } from '../utils/db';
import { RowDataPacket } from 'mysql2';

export default function local() {
  passport.use(
    new LocalStrategy(
      { usernameField: 'username', passwordField: 'password' }, // Adjust to match your request body
      async (username, password, done) => {
        try {
          const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM account WHERE username = ?', [username]);
          const account = rows[0];

          if (!account) {
            return done(null, false, { message: 'Incorrect username or password.' });
          }

          const match = await bcrypt.compare(password, account.password);
          if (!match) {
            return done(null, false, { message: 'Incorrect email or password.' });
          }

          return done(null, account); // Successful authentication
        } catch (error) {
          return done(error);
        }
      }
    )
  );
}
