import userModel from '../models/userModel.js';

export const createSubscription = async (req, res) => {
  try {
    const sub = req.body;
    const userId = req.userId; // Або req.user.id, залежно від вашого middleware

    if (!sub || !sub.endpoint) {
        return res.status(400).json({ message: 'Invalid subscription data' });
    }

    const updated = await userModel.findByIdAndUpdate(
      userId,
      { 
        $set: { 
          subscribeUser: {
            endpoint: sub.endpoint,
            keys: {
              p256dh: sub.keys?.p256dh,
              auth: sub.keys?.auth
            }
          }
        } 
      },
      { new: true, runValidators: true }
    );

    if (!updated) return res.status(404).json({ message: 'User not found' });

    return res.status(201).json({ success: true, data: updated.subscribeUser });
  } catch (err) {
    console.error('createSubscription error:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export default createSubscription;