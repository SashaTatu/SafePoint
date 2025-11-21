import Device from '../models/deviceModel.js';
import mongoose from 'mongoose';
import jwt from "jsonwebtoken";

export const GetDeviceById = async (req, res) => {
  const { deviceId } = req.params;
  
  const device = await Device.findById(deviceId);

  if (!device) return res.status(404).json({ success: false, error: 'Пристрій не знайдено' });

  res.json({
    success: true,
    deviceId: device._id,
    address: device.address,
    status: device.status
  });
};

export const deviceParameterPost = async (req, res) => {
    console.log("POST PARAMS:", req.params);
    console.log("BODY:", req.body);

    const { deviceId } = req.params;
    console.log("EXTRACTED deviceId:", deviceId);

    const { temperature, humidity } = req.body;

    if (temperature === undefined || humidity === undefined) {
        return res.status(400).json({ success: false, message: "Missing temperature or humidity" });
    }

    try {
        const device = await DeviceModel.findOne({ deviceId });
        console.log("FOUND DEVICE:", device);

        if (!device) {
            return res.status(404).json({ success: false, message: "Device not found" });
        }

        device.lastTemperature = temperature;
        device.lastHumidity = humidity;
        device.updatedAt = new Date();

        await device.save();

        return res.status(200).json({ success: true, message: "Data saved successfully" });

    } catch (error) {
        console.error("❌ SERVER ERROR:", error);
        return res.status(500).json({ success: false, message: "Server error" });
    }
};

export const deviceParameterGet = async (req, res) => {
    const { deviceId } = req.params;

    try {
        const device = await DeviceModel.findOne({ deviceId });
        if (!device) {
            return res.status(404).json({ success: false, message: "Device not found" });
        }

        return res.status(200).json({
            success: true,
            data: [{
                temperature: device.lastTemperature,
                humidity: device.lastHumidity
            }]
        });

    } catch (error) {
        console.error('❌ Помилка отримання пристрою:', error);
        return res.status(500).json({ success: false, message: 'Внутрішня помилка сервера' });
    }
};
