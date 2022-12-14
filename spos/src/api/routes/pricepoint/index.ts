import { body, param, validationResult } from 'express-validator';
import * as express from 'express';
import Container from 'typedi';
import ProductService from '../../../services/ProductService';
import { adminAuth } from '../../middleware';
import PricePointService from '../../../services/PricePointService';
import SubscriberService from '../../../services/SubscriberService';

const router = express.Router();


router.post('/reset', adminAuth, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const pricePointService = Container.get(PricePointService);
  const subscriberService = Container.get(SubscriberService);

  await pricePointService.reset();
  await subscriberService.updateLastExecution();
  
  return res.status(200).json({ success: true });
});

router.post(
  '/:id',
  param('id').isInt(),
  body('value').isNumeric(),
  adminAuth,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const productService = Container.get(ProductService);
    const pricePointService = Container.get(PricePointService);
    const subscriberService = Container.get(SubscriberService);

    if (!productService.find(req.params.id))
      return res.status(400).json({ errors: [{ msg: 'Product not found' }] });

    const pricePoint = await pricePointService.create(
      req.params.id,
      req.body.value
    );

    if (!pricePoint)
      return res
        .status(400)
        .json({ errors: [{ msg: 'Something went wrong' }] });

    await subscriberService.updateLastExecution();
    const result = await productService.find(req.params.id, ['price_points']);
    res.status(200).json({ product: result });
  }
);



export default router;
