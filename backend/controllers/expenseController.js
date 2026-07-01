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

const getSettlements = asyncHandler(async (req, res) => {
    const groupId = req.params.groupId;
    const group = await Group.findById(groupId).populate('members', 'name');
    if (!group) {
        res.status(404);
        throw new Error('Group not found');
    }
    const isRequesterInGroup = group.members.some(memberId => memberId.equals(req.user._id));
    if (!isRequesterInGroup) {
        res.status(403);
        throw new Error('You are not a member of this group');
    }

    const expenses = await Expense.find({ group: groupId });

    const balances = {};

    expenses.forEach(expense => {
         const splitAmount = Math.round((expense.amount / expense.splitAmong.length) * 100) / 100;
        const payerId = expense.paidBy.toString();

        //  Give the payer their money back (+ balance)
        if (!balances[payerId]) balances[payerId] = 0;
        balances[payerId] += expense.amount;

        //  Charge everyone who was part of the split (- balance)
        expense.splitAmong.forEach(member => {
            const memberId = member.toString();
            if (!balances[memberId]) balances[memberId] = 0;
            balances[memberId] -= splitAmount;
        });
    });

    const memberMap = {};
    group.members.forEach((member) => {
        memberMap[member._id.toString()] = member.name;
    });

    const transactions = [];

   let debtors = [];
    let creditors = [];
    

    for (const userId in balances) {
        if (balances[userId] < 0) {
            debtors.push({ userId, amount: -balances[userId] });
        } else if (balances[userId] > 0) {
            creditors.push({ userId, amount: balances[userId] });
        }
    }

   debtors.sort((a, b) => a.amount - b.amount);
    creditors.sort((a, b) => a.amount - b.amount);

    while (debtors.length > 0 && creditors.length > 0) {
        const debtor = debtors[debtors.length - 1];
        const creditor = creditors[creditors.length - 1];

        const payment = Math.min(debtor.amount, creditor.amount);

       transactions.push({
            from: debtor.userId,
            fromName: memberMap[debtor.userId],
            to: creditor.userId,
            toName: memberMap[creditor.userId],
            amount: payment
        });

        debtor.amount -= payment;
        creditor.amount -= payment;

        if (debtor.amount < 0.01) debtors.pop();
        if (creditor.amount < 0.01) creditors.pop();
        
    }

    res.status(200).json(transactions);
});




export { addExpense, getGroupExpenses, getSettlements };

