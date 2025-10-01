import express from 'express';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authenticateToken, async (req, res) => {
  try {
    const departments = [
      {
        id: '1',
        name: 'General Consulting',
        description: 'General business consulting services',
        is_active: true,
        sort_order: 1
      },
      {
        id: '2',
        name: 'Legal & Compliance',
        description: 'Legal and regulatory compliance services',
        is_active: true,
        sort_order: 2
      },
      {
        id: '3',
        name: 'Financial Advisory',
        description: 'Financial planning and advisory services',
        is_active: true,
        sort_order: 3
      }
    ];

    res.json({ departments });
  } catch (error) {
    console.error('Error fetching departments:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
