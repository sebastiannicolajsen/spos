import * as express from 'express';
import { body, param, validationResult } from 'express-validator';
import Container from 'typedi';
import { SellerRole } from '../../../models/Seller';
import SellerService from '../../../services/SellerService';
import { adminAuth, jwtAuth } from '../../middleware';

const router = express.Router();

router.get('/', jwtAuth, adminAuth, async (req, res) => {
  const sellerService = Container.get(SellerService);
  const result = await sellerService.get();
  return res.json({
    sellers: result,
  });
});

router.get(
  '/:id',
  param('id').isInt(),
  jwtAuth,
  adminAuth,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const sellerService = Container.get(SellerService);
    const result = await sellerService.find(req.params.id);
    if (!result)
      return res.status(400).json({ errors: [{ msg: 'Seller not found' }] });
    return res.json({
      seller: result,
    });
  }
);

router.delete(
  '/:id',
  param('id').isInt(),
  jwtAuth,
  adminAuth,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const sellerService = Container.get(SellerService);
    const result = await sellerService.delete(req.params.id);

    if (!result)
      return res.status(400).json({ errors: [{ msg: 'Seller not found' }] });
    return res.json({
      success: true,
    });
  }
);

router.post(
  '/',
  body('username').isString(),
  body('password').isString(),
  body('role').isIn([SellerRole.ADMIN, SellerRole.DEFAULT]),
  jwtAuth,
  adminAuth,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const sellerService = Container.get(SellerService);
    const { username, password, role } = req.body;
    const result = await sellerService.create(username, password, role);

    if (!result)
      return res
        .status(400)
        .json({ errors: [{ msg: 'Something went wrong' }] });
    return res.json({
      seller: result,
    });
  }
);

export default router;
