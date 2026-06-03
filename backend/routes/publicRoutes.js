import { Router } from 'express';
import { getPublicStatistics } from '../controllers/publicController.js';

const router = Router();

router.get('/stats/:shortCode', getPublicStatistics);

export default router;
