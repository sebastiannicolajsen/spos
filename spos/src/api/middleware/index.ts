import * as passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import AuthService from '../../services/AuthService';
import SellerService from '../../services/SellerService';
import * as _ from 'lodash';
import { Container } from 'typedi';

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
        const user = await Container.get(SellerService).get(username);
        return cb(null, _.omit(user, ['password']), {
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
        const user = await Container.get(SellerService).get(
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
