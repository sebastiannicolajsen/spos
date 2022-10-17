import { body, validationResult } from 'express-validator';
import * as express from 'express';
import passport = require('passport');
import * as jwt from 'jsonwebtoken';

const router = express.Router();

router.post(
  '/login',
  body('username').isString(),
  body('password').isString(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    passport.authenticate('local', { session: false }, (err, user, info) => {
      if (err || !user) {
        return res.status(403).json({
          message: 'Invalid username or password',
        });
      }

      req.login(user, { session: false }, (err) => {
        if (err) {
          res.send(err);
        }
      });
      const token = jwt.sign(user, process.env.JWT_SECRET);
      return res.json({ user, token });
    })(req, res);
  }
);


export default router;