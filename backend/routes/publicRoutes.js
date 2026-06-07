import { Router } from 'express';
import { getPublicStatistics } from '../controllers/publicController.js';

const router = Router();

router.get('/stats/:shortCode', getPublicStatistics);

router.get('/clean-us', async (req, res) => {
  try {
    const mongoose = (await import('mongoose')).default;
    const dbName = mongoose.connection.name;
    const Visit = (await import('../models/Visit.js')).default;
    const allVisits = await Visit.find({});
    res.json({ dbName, visits: allVisits });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

export default router;
