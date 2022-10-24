import * as express from 'express';
import { body, param, validationResult } from 'express-validator';
import Container from 'typedi';
import SubscriberService from '../../../services/SubscriberService';
import { adminAuth, jwtAuth } from '../../middleware';

const router = express.Router();

router.get('/', adminAuth, async (req, res) => {
  const subscriberService = Container.get(SubscriberService);
  const result = await subscriberService.get();
  return res.json({
    subscribers: result,
  });
});

router.get(
  '/:id',
  param('id').isString(),
  jwtAuth,
  adminAuth,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const subscriberService = Container.get(SubscriberService);
    const result = await subscriberService.find(req.params.id);
    if (!result)
      return res
        .status(400)
        .json({ errors: [{ msg: 'Subscriber not found' }] });
    return res.json({
      subscriber: result,
    });
  }
);

router.delete(
  '/:id',
  param('id').isString(),
  jwtAuth,
  adminAuth,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const subscriberService = Container.get(SubscriberService);
    const result = await subscriberService.delete(req.params.id);
    if (!result)
      return res
        .status(400)
        .json({ errors: [{ msg: 'Subscriber not found' }] });
    return res.json({
      success: true,
    });
  }
);

router.post(
  '/',
  body('id').isString(),
  body('events').isArray(),
  body('objects').isArray(),
  body('code').isString(),
  jwtAuth,
  adminAuth,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const subscriberService = Container.get(SubscriberService);
    const result = await subscriberService.create(
      req.body.id,
      req.body.events,
      req.body.objects,
      req.body.code
    );
    if (!result)
      return res
        .status(400)
        .json({ errors: [{ msg: 'Something went wrong' }] });
    return res.json({
      subscriber: result,
    });
  }
);

router.post(
  '/validate',
  body('id').isString(),
  body('objects').isArray(),
  body('code').isString(),
  jwtAuth,
  adminAuth,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const subscriberService = Container.get(SubscriberService);
    const result = await subscriberService.validate(
      req.body.id,
      req.body.objects,
      req.body.code
    );
    if (!result)
      return res
        .status(400)
        .json({ errors: [{ msg: 'Something went wrong' }] });
    return res.status(200).json({
      valid: true,
    });
  }
);

export default router;
