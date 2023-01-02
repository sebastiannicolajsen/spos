import * as express from 'express';
import Container from 'typedi';
import SubscriberService from '../../../services/SubscriberService';

const router = express.Router();

router.get('/', async (req, res) => {
  const subscriberService = Container.get(SubscriberService);
  const result = await subscriberService.getLastExecution();
  return res.json({
    last_execution: result,
  });
});

export default router;
