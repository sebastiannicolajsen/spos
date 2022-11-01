import { body, validationResult } from 'express-validator';
import * as express from 'express';
import passport = require('passport');
import * as jwt from 'jsonwebtoken';
import { adminAuth } from '../../middleware';
import Container from 'typedi';
import EventService from '../../../services/EventService';

const router = express.Router();

router.get(
  '/',
  adminAuth,
  async (req, res) => {
    const events = await Container.get(EventService).get();
    res.json({ events });
  }
);


export default router;