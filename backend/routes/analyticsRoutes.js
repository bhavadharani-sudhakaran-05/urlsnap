import { Router } from 'express';
import { getUrlAnalytics, getGlobalAnalytics } from '../controllers/analyticsController.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.use(protect);
router.get('/global', getGlobalAnalytics);
router.get('/:id', getUrlAnalytics);

export default router;
