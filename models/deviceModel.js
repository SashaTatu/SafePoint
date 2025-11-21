import mongoose from 'mongoose';

const deviceSchema = new mongoose.Schema({
  deviceId: { type: String, required: true, unique: true },
  ssid : { type: String, default: '' },
  wifipassword : { type: String, default: '' },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  status: { type: String, default: 'В очікуванні' },
  mac: { type: String, default: '' },
  temperature: { type: Number, default: '' },
  humidity: { type: Number, default: '' },
  address: { type: String, default: '' },
  location: { type: String, default: '' }
});

const Device = mongoose.models.device || mongoose.model('Device', deviceSchema);

export default Device;