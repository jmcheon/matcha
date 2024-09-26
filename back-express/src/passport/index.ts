import passport from 'passport';
import local from './localStrategy'
import google from './googleStrategy'
import { getAccountById } from '../models/account.model';
import ft from './ftStrategy';
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
  google();
  ft();
};
