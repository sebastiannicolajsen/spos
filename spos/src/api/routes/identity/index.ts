import * as express from 'express';
import { jwtAuth } from '../../middleware';

const router = express.Router();

router.get('/', jwtAuth, async (req, res) => {
  return res.json({
    user: req.user,
  });
});

export default router;
