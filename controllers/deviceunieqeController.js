import Device from '../models/deviceModel.js';
import mongoose from 'mongoose';
import jwt from "jsonwebtoken";

export const GetDeviceById = async (req, res) => {
  const { deviceId } = req.body;
  
  const device = await Device.findById(deviceId);

  if (!device) return res.status(404).json({ success: false, error: 'Пристрій не знайдено' });

  res.json({
    success: true,
    deviceId: device._id,
    address: device.address,
    status: device.status
  });
};

export const deviceParameter = async (req, res) => {
  const { deviceId } = req.params;
    const { temperature, humidity } = req.body;

    if (!temperature || !humidity) {
        return res.status(400).json({ success: false, message: "Missing temperature or humidity" });
    }

    try {
        const device = await DeviceModel.findOne({ deviceId });
        if (!device) {
            return res.status(404).json({ success: false, message: "Device not found" });
        }

        
        device.lastTemperature = temperature;
        device.lastHumidity = humidity;
        device.updatedAt = new Date();

        await device.save();

        return res.status(200).json({ success: true, message: "Data saved successfully" });
    } catch (error) {
        console.error("Error saving device data:", error);
        return res.status(500).json({ success: false, message: "Server error" });
    }
};