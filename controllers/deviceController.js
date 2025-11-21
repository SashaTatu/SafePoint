import Device from '../models/deviceModel.js';
import bcrypt from "bcryptjs";
import mongoose from 'mongoose';
import jwt from "jsonwebtoken";


export const registerDevice = async (req, res) => {
  const { deviceId, mac, ssid, wifipassword } = req.body;

  if (!deviceId || typeof deviceId !== 'string' || !deviceId.trim()) {
    return res.status(400).json({ success: false, message: 'Некоректний deviceId' });
  }

  try {
    const existing = await Device.findOne({ deviceId: deviceId.trim() });
    if (existing) {
      return res.status(409).json({ success: false, message: 'Такий ID вже існує' });
    }
    const macexisting = await Device.findOne({ mac: mac.trim() });
    if (macexisting) {
      return res.status(409).json({ success: false, message: 'Такий MAC вже існує' });
    }

    const hashedPassword = await bcrypt.hash(wifipassword, 10);

    const newDevice = new Device({
      deviceId: deviceId.trim(),
      ssid: ssid.trim(),
      wifipassword: hashedPassword,
      mac: mac.trim(), 
      status: 'pending'
    });

    await newDevice.save();

    return res.status(201).json({
      success: true,
      message: 'Пристрій ESP32 зареєстровано',
      data: {
        deviceId: newDevice.deviceId,
        mac: newDevice.mac,
        ssid: newDevice.ssid,
        wifipassword: newDevice.wifipassword,
        status: newDevice.status
      }
    });
  } catch (error) {
    console.error('❌ Помилка реєстрації ESP32:', error);
    return res.status(500).json({ success: false, message: 'Внутрішня помилка сервера' });
  }
};

export const addDevice = async (req, res) => {
  const { deviceId, address } = req.body;
  const userId = req.userId 

  if (!deviceId || !address) {
    return res.status(400).json({ success: false, message: 'Заповніть всі поля' });
  }

  try {
    const device = await Device.findOne({ deviceId });

    if (!device) {
      return res.status(404).json({ success: false, message: 'Пристрій не знайдено' });
    }

    if (device.owner && !device.owner.equals(userId)) {
      return res.status(409).json({
        success: false,
        message: 'Пристрій вже зайнятий іншим користувачем'
      });
    }

    if (device.owner && device.owner.equals(userId)) {
      return res.status(400).json({
        success: false,
        message: 'Пристрій вже додано'
      });
    }

    device.owner = userId;
    device.address = address;
    device.trusted = true;
    device.status = 'Зачинено';

    await device.save();

    return res.status(200).json({
      success: true,
      message: 'Пристрій успішно доданий',
      data: {
        deviceId: device.deviceId,
        owner: device.owner,
        address: device.address,
        status: device.status
      }
    });
  } catch (error) {
    console.error('❌ Помилка входу ESP32:', error);
    return res.status(500).json({ success: false, message: 'Внутрішня помилка сервера' });
  }
};

export const deleteDevice = async (req, res) => {
    const { deviceId } = req.body;

  try {
    const device = await Device.findOne({ deviceId });

    if (!device) {
      return res.status(404).json({ success: false, message: 'Пристрій не знайдено' });
    }

    device.owner = null;
    device.status = 'pending';
    device.address = ''; 

    await device.save();

    return res.status(200).json({
      success: true,
      message: 'Пристрій успішно очищено',
      data: { deviceId }
    });
  } catch (error) {
    console.error('❌ Помилка очищення ESP32:', error);
    return res.status(500).json({ success: false, message: 'Внутрішня помилка сервера' });
  }
};

export const ShowAllDevices = async (req, res) => {
  
  const userId = req.userId 

  try {
    const devices = await Device.find({ owner: userId });

    if (!devices || devices.length === 0) {
      return res.status(404).json({ success: false, message: 'Пристрої не знайдено' });
    }

    return res.status(200).json({
      success: true,
      data: devices.map(device => ({
        deviceId: device.deviceId,
        address: device.address,
        status: device.status
      }))
    });
  } catch (error) {
    console.error('❌ Помилка отримання пристроїв:', error);
    return res.status(500).json({ success: false, message: 'Внутрішня помилка сервера' });
  }
}



  