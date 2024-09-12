import passport from 'passport';
import { getAccountById } from '../services/account.service';
import local from './localStrategy'
export default () => {
  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id: number, done) => {
    getAccountById(id)
      .then((user) => done(null, user))
      .catch((err) => done(err));
  });

  local();
};
