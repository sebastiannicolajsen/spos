import * as express from 'express';

const router = express.Router();

router.get('/', async (req, res) => {
  return res.json({
    user: req.user,
  });
});

export default router;
