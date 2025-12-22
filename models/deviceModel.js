import mongoose from 'mongoose';

const deviceSchema = new mongoose.Schema({
  deviceId: { type: String, required: true, unique: true },
  ssid : { type: String, default: '' },
  wifipassword : { type: String, default: '' },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  alert: { type: Boolean, default: false },
  status: { type: Boolean, default: false },
  temperature: { type: Number, default: 0 },
  humidity: { type: Number, default: 0 },
  co2: { type: Number, default: 0 },
  address: { type: String, default: '' }
});

const Device = mongoose.models.device || mongoose.model('Device', deviceSchema);

export default Device;