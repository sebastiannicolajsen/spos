import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as passport from 'passport';
import './middleware';

import auth from './routes/auth';
import identity from './routes/identity';
import { Server } from 'http';

const app = express();
const router = express.Router();
const port = process.env.PORT || 3000;

const jwtAuth = passport.authenticate('jwt', { session: false });

export default (): Server => {
  router.use(bodyParser.json());
  router.use(
    bodyParser.urlencoded({
      extended: true,
    })
  );

  // availability path
  router.get('/', (req, res) => {
    res.json({ message: 'ok' });
  });

  router.use('/auth', auth);
  router.use('/whoami', jwtAuth, identity);

  /* Error handler middleware */
  router.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    console.error(err.message, err.stack);
    res.status(statusCode).json({ message: err.message });
    return;
  });

  app.use('/api', router);

  return app.listen(port, () => {
    console.log(`SPOS listening at http://localhost:${port}`);
  });
};
