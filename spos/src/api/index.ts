import * as express from 'express';
import * as bodyParser from 'body-parser';
import './middleware';
import { Server } from 'http';
import log from './routes/logging';
import cors = require('cors');

const app = express();
const router = express.Router();
const port = process.env.PORT || 3000;



export default (): Server => {
  router.use(bodyParser.json());
  router.use(
    bodyParser.urlencoded({
      extended: true,
    })
  );

  app.use(cors())

  // availability path
  router.get('/', (req, res) => {
    res.json({ message: 'ok' });
  });

  // default paths:
  router.use('/auth', require('./routes/auth').default);
  router.use('/whoami', require('./routes/identity').default);
  router.use('/product', require('./routes/product').default);
  router.use('/price_point', require('./routes/pricepoint').default);
  router.use('/transaction', require('./routes/transaction').default);
  router.use('/subscriber', require('./routes/subscriber').default);
  router.use('/cron', require('./routes/cron').default);
  router.use('/seller', require('./routes/seller').default);

  router.use('/last_execution', require('./routes/subscriber/last-execution').default);
  router.use('/events', require('./routes/events').default);

  // setup event logging dashboard:
  if(process.env.NODE_ENV !== 'test') log();

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
