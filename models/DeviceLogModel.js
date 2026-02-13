import mongoose from 'mongoose';

const deviceLogSchema = new mongoose.Schema({
    deviceId: { type: String, required: true, index: true },
    temperature: Number,
    humidity: Number,
    co2: Number,
    timestamp: { type: Date, default: Date.now, expires: '7d' } // Дані за 7 днів видаляться самі
});

const DeviceLog = mongoose.model('DeviceLog', deviceLogSchema);

export default DeviceLog