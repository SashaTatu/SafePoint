import mongoose from 'mongoose';

const deviceSchema = new mongoose.Schema({
  deviceId: { type: String, required: true, unique: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  status: { type: String, default: 'pending' },
  address: { type: String, default: '' },
  location: { type: String, default: '' }
});

const Device = mongoose.models.device || mongoose.model('Device', deviceSchema);

export default Device;