import e from 'express';
import userModel from '../models/userModel.js';

export const createSubscription = (async (req, res) => {
  const sub = req.body;
  const userId = req.user.id;

  await userModel.findByIdAndUpdate(userId, {
    subscribeUser: sub
  });

  res.sendStatus(201);
});

export default createSubscription;