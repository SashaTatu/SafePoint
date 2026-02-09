
import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: String,
  body: String,
  type: { type: String, enum: ['alert', 'temp', 'co2', 'humi'] }, // для іконок
  createdAt: { type: Date, default: Date.now },
  isRead: { type: Boolean, default: false }
});

const Notification = mongoose.model('Notification', notificationSchema);

export default Notification;