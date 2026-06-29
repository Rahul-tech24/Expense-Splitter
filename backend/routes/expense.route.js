import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { addExpense, getGroupExpenses, getSettlements } from '../controllers/expenseController.js';

const router = express.Router();

// The :groupId in the URL is what req.params.groupId grabs!
router.post('/:groupId', protect, addExpense);
router.get('/:groupId/settle', protect, getSettlements);
router.get('/:groupId', protect, getGroupExpenses);

export default router;