import express from 'express';
import { getPublicEvents, getPublicEventBySlug } from '../controllers/publicController.js';

const router = express.Router();

router.get('/events', getPublicEvents);
router.get('/events/:slug', getPublicEventBySlug);

export default router;