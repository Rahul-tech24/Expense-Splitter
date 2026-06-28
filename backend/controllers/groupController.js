

import asyncHandler from 'express-async-handler';
import Group from '../models/group.js';
import User from '../models/user.js';

const createGroup = asyncHandler(async (req, res) => {
    const { name, } = req.body;
    const userId = req.user._id;

    if (!name) {
        res.status(400);
        throw new Error('Group name is required');
    }

    const group = await Group.create({
        name,
        createdBy: userId,
        members: [userId],
    });

    res.status(201).json(group);
});

const getGroups = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const groups = await Group.find({ members: userId }).populate('members', 'name email');
    res.json(groups);
}
);

const addMember = asyncHandler(async (req, res) => { 
       const {email} = req.body;
    const groupId = req.params.id;
    const userId = req.user._id;
    
    const group = await Group.findById(groupId);
    if (!group) {
        res.status(404);
        throw new Error('Group not found');
    } 

    const isRequesterInGroup = group.members.some(memberId => memberId.equals(userId));
if (!isRequesterInGroup) {
    res.status(403);
    throw new Error('You are not a member of this group');
    }
    

    const userToAdd = await User.findOne({ email });
    if (!userToAdd) {
        res.status(404);
        throw new Error('User not found');
    }

    const isFriendInGroup = group.members.some(memberId => memberId.equals(userToAdd._id));
if (isFriendInGroup) {
    res.status(400);
    throw new Error('User is already a member of this group');
}

    group.members.push(userToAdd._id);
    await group.save();

    res.status(200).json({ message: 'Member added successfully', group: await group.populate('members', 'name email') });
});



export { createGroup, getGroups, addMember};