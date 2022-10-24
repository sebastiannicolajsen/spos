import { body, param, validationResult } from 'express-validator';
import * as express from 'express';
import Container from 'typedi';
import { jwtAuth } from '../../middleware';
import TransactionService from '../../../services/TransactionService';

const router = express.Router();

router.post(
  '/',
  body('items.*.product_id').isInt(),
  body('items.*.quantity').isInt(),
  body('items.*.price_point_id').isInt(),
  jwtAuth,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    console.log(req.user)
    const transactionService = Container.get(TransactionService);
    const transaction = await transactionService.create(
      (req.user as any)?.id,
      req.body.items
    );
    if (!transaction)
      return res.status(400).json({ errors: [{ msg: 'Something went wrong' }] });

    res.status(200).json({ success: true });
  }
);

router.get('/', jwtAuth, async (req, res) => {
  const transactionService = Container.get(TransactionService);

  const results = await transactionService.get();

  if (!results)
    return res.status(400).json({ errors: [{ msg: 'Something went wrong' }] });

  res.status(200).json({ transactions: results });
});

router.get('/:id', param('id').isNumeric(), jwtAuth, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const transactionService = Container.get(TransactionService);
  const transaction = await transactionService.find(req.params.id);
  res.status(200).json({ transaction });
});

router.delete('/:id', param('id').isNumeric(), jwtAuth, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const transactionService = Container.get(TransactionService);
  const transaction = await transactionService.delete(req.params.id);
  res.status(200).json({ success: true });
});

export default router;
