
import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { createGroup, getGroups, addMember } from '../controllers/groupController.js';


const router = express.Router();


router.post('/', protect, createGroup);
router.get('/', protect, getGroups);
router.post('/:id/members', protect, addMember);

export default router;

