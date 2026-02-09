import express from 'express';
import sendPushToRegion from '../controllers/pushNotificationController.js';
const router = express.Router();


router.post('/trigger-alert', async (req, res) => {
  const { region, title, message } = req.body;

  try {
    const result = await sendPushToRegion(User, region, title, message);
    res.json({ message: `Розсилка розпочата для ${result.count} користувачів` });
  } catch (err) {
    res.status(500).json({ error: 'Не вдалося надіслати сповіщення' });
  }
});