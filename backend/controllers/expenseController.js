import asyncHandler from 'express-async-handler';

import Expense from '../models/expense.js';
import Group from '../models/group.js';

const addExpense = asyncHandler(async (req, res) => { 
    
    const { description, amount, paidBy, splitAmong } = req.body;
    const groupId = req.params.groupId;

    if (!description || !amount || !paidBy || !groupId || !splitAmong) {
        res.status(400);
        throw new Error('Please provide all required fields');
    }

    const group = await Group.findById(groupId);
    if (!group) {
        res.status(404);
        throw new Error('Group not found');
    }

    const isRequesterInGroup = group.members.some(memberId => memberId.equals(req.user._id));
    if (!isRequesterInGroup) {
        res.status(403);
        throw new Error('You are not a member of this group');
    }

    const expense = await Expense.create({
        description,
        amount,
        paidBy,
        group: group._id,
        splitAmong
    });

    res.status(201).json(expense);

});

const getGroupExpenses = asyncHandler(async (req, res) => {
    const groupId = req.params.groupId;
    const group = await Group.findById(groupId);
    if (!group) {
        res.status(404);
        throw new Error('Group not found');
    }

    const isRequesterInGroup = group.members.some(memberId => memberId.equals(req.user._id));
    if (!isRequesterInGroup) {
        res.status(403);
        throw new Error('You are not a member of this group');
    }


    const expenses = await Expense.find({ group: groupId }).populate('paidBy', 'name email').populate('splitAmong', 'name email').sort({ createdAt: -1 });

    res.status(200).json(expenses);
});

export { addExpense, getGroupExpenses };