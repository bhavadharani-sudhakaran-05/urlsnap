import { Router } from 'express';
import { body } from 'express-validator';
import {
  createUrl,
  getAllUrls,
  getUrlById,
  updateUrl,
  deleteUrl,
  bulkUploadCsv,
} from '../controllers/urlController.js';
import { protect } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

const router = Router();

router.use(protect);

router.post(
  '/create',
  [
    body('originalUrl').notEmpty().withMessage('Original URL is required'),
    body('customAlias').optional().trim(),
    body('expiryDate').optional().isISO8601().withMessage('Invalid expiry date'),
  ],
  validate,
  createUrl
);

router.post('/bulk', bulkUploadCsv);

router.get('/all', getAllUrls);
router.get('/:id', getUrlById);
router.put('/:id', updateUrl);
router.delete('/:id', deleteUrl);

export default router;
