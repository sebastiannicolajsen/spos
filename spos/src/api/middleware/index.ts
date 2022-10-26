import * as passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import AuthService from '../../services/AuthService';
import SellerService from '../../services/SellerService';
import * as _ from 'lodash';
import { Container } from 'typedi';
import { SellerRole } from '../../models/Seller';

passport.use(
  'local',
  new LocalStrategy(
    {
      usernameField: 'username',
      passwordField: 'password',
    },
    async (username, password, cb) => {
      const valid = await Container.get(AuthService).validate(
        username,
        password
      );
      if (valid) {
        const user = await Container.get(SellerService).findByUsername(username);
        return cb(null, user, {
          message: 'Logged In Successfully',
        });
      } else {
        return cb(null, false, { message: 'Incorrect username or password.' });
      }
    }
  )
);

passport.use(
  'jwt',
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
      passReqToCallback: true,
    },
    async (req, jwtPayLoad, cb) => {
      try {
        const user = await Container.get(SellerService).findByUsername(
          jwtPayLoad.username
        );
        if (!user) return cb('User must be logged In', false);
        const clean = _.omit(user, ['password']);
        req.user = clean;
        return cb(null, clean);
      } catch (error) {
        return cb(error, false);
      }
    }
  )
);

const isAdmin = (req, res, next) => {
  if (req.user.role === SellerRole.ADMIN) {
    next();
  } else {
    res.status(401).json({ message: 'Unauthorized role' });
  }
}


export const jwtAuth = passport.authenticate('jwt', { session: false });
export const adminAuth = [jwtAuth, isAdmin]