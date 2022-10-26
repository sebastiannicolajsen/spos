import { body, param, validationResult } from 'express-validator';
import * as express from 'express';
import Container from 'typedi';
import ProductService from '../../../services/ProductService';
import { adminAuth } from '../../middleware';
import PricePointService from '../../../services/PricePointService';

const router = express.Router();

router.get('/', async (req, res) => {
  const productService = Container.get(ProductService);

  const products = await productService.get(['price_points']);

  if (!products)
    res.status(400).json({ errors: [{ msg: 'Something went wrong' }] });

  res.status(200).json({ products });
});

router.get('/:id', param('id').isInt(), async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const productService = Container.get(ProductService);
  const product = await productService.find(req.params.id, ['price_points']);
  if (!product)
    return res.status(400).json({ errors: [{ msg: 'Product not found' }] });

  res.status(200).json({ product });
});

router.post(
  '/',
  body('name').isString(),
  body('initial_value').isNumeric(),
  body('minimum_value').isNumeric(),
  adminAuth,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, initial_value, minimum_value } = req.body;

    const productService = Container.get(ProductService);
    const pricePointService = Container.get(PricePointService);

    const product = await productService.create(
      name,
      initial_value,
      minimum_value
    );

    if (!product)
      return res
        .status(400)
        .json({ errors: [{ msg: 'Something went wrong' }] });

    const pricePoint = await pricePointService.create(
      product.id,
      initial_value
    );

    if (!pricePoint)
      return res
        .status(400)
        .json({ errors: [{ msg: 'Something went wrong' }] });

    const updated = await productService.find(product.id);
    res.status(200).json({ product: updated });
  }
);

router.put(
  '/:id',
  param('id').isInt(),
  body('name').isString().optional(),
  body('initial_value').isNumeric().optional(),
  body('minimum_value').isNumeric().optional(),
  adminAuth,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const productService = Container.get(ProductService);
    const product = await productService.update(req.params.id, req.body);
    if (!product)
      return res.status(400).json({ errors: [{ msg: 'Product not found' }] });
    res.status(200).json({ product });
  }
);

router.delete('/:id', param('id').isInt(), adminAuth, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const productService = Container.get(ProductService);
  const product = await productService.delete(req.params.id);
  if (!product)
    return res.status(400).json({ errors: [{ msg: 'Product not found' }] });
  res.status(200).json({ success: true });
});

router;

export default router;
