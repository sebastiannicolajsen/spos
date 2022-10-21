import * as express from 'express';
import * as bodyParser from 'body-parser';
import './middleware';
import { Server } from 'http';

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

  // availability path
  router.get('/', (req, res) => {
    res.json({ message: 'ok' });
  });

  router.use('/auth', require('./routes/auth').default);
  router.use('/whoami', require('./routes/identity').default);
  router.use('/product', require('./routes/product').default);
  router.use('/pricepoint', require('./routes/pricepoint').default);
  router.use('/transaction', require('./routes/transaction').default);

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
