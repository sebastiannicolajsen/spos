import * as express from 'express';
import { body, param, validationResult } from 'express-validator';
import Container from 'typedi';
import CronService from '../../../services/CronService';
import { adminAuth } from '../../middleware';

const router = express.Router();


router.get('/', adminAuth, async (req, res) => {
  const cronService = Container.get(CronService);
  const result = await cronService.get();
  return res.json({
    jobs: result,
  });
});

router.get(
  '/:id',
  param('id').isString(),
  adminAuth,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const cronService = Container.get(CronService);
    const result = await cronService.find(req.params.id);
    if (!result)
      return res.status(400).json({ errors: [{ msg: 'Job not found' }] });
    return res.json({
      job: result,
    });
  }
);

router.post(
  '/:id/pause',
  param('id').isString(),
  adminAuth,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const cronService = Container.get(CronService);
    const result = await cronService.pause(req.params.id);
    if (!result)
      return res
        .status(400)
        .json({ errors: [{ msg: 'Something went wrong' }] });
    return res.json({
      success: true,
    });
  }
);

router.post(
  '/:id/restart',
  param('id').isString(),
  adminAuth,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const cronService = Container.get(CronService);
    const result = await cronService.restart(req.params.id);
    if (!result)
      return res
        .status(400)
        .json({ errors: [{ msg: 'Something went wrong' }] });
    return res.json({
      success: true,
    });
  }
);

router.delete(
  '/:id',
  param('id').isString(),
  adminAuth,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const cronService = Container.get(CronService);
    const result = await cronService.delete(req.params.id);

    if (!result)
      return res.status(400).json({ errors: [{ msg: 'Job not found' }] });
    return res.json({
      success: true,
    });
  }
);

router.post(
  '/',
  body('id').isString(),
  body('event').isString(),
  body('interval').isString().matches(/((\*|\d)(|\/[\d]+)\s?){6,6}/gm), // only allows intervals (no fixed time)
  adminAuth,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const cronService = Container.get(CronService);
    const result = await cronService.create(
      req.body.id,
      req.body.event,
      req.body.interval
    );

    if (!result)
      return res
        .status(400)
        .json({ errors: [{ msg: 'Something went wrong' }] });
    return res.json({
      job: result,
    });
  }
);

export default router;
