import userModel from '../models/userModel.js';

export const createSubscription = async (req, res) => {
  try {
    const sub = req.body;
    const userId = req?.user?.id;

    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const updated = await userModel.findByIdAndUpdate(
      userId,
      { $set: { subscribeUser: sub } },
      { new: true, runValidators: true }
    );

    if (!updated) return res.status(404).json({ message: 'User not found' });

    return res.sendStatus(201);
  } catch (err) {
    console.error('createSubscription error:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export default createSubscription;