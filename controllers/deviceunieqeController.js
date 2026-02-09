import Device from '../models/deviceModel.js';
import mongoose from 'mongoose';
import jwt from "jsonwebtoken";
import User from '../models/userModel.js';
import { sendNotification } from '../services/pushService.js';


export const GetDeviceById = async (req, res) => {
  const { deviceId } = req.params;
  
  const device = await Device.findOne({ deviceId });


  if (!device) return res.status(404).json({ success: false, error: 'Пристрій не знайдено' });

  res.json({
    success: true,
    deviceId: device._id,
    address: device.address,
    status: device.status
  });
};

export const deviceParameterPost = async (req, res) => {
  const { deviceId } = req.params;
  const { temperature, humidity, co2 } = req.body;

  if (temperature === undefined || humidity === undefined || co2 === undefined) {
    return res.status(400).json({ success: false, message: "Missing temperature or humidity or co2" });
  }

  try {
    const device = await Device.findOne({ deviceId });
    if (!device) {
      return res.status(404).json({ success: false, message: "Device not found" });
    }

    // Змінено на правильні поля
    device.temperature = temperature;
    device.humidity = humidity;
    device.co2 = co2;
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
        const device = await Device.findOne({ deviceId });
        if (!device) {
            return res.status(404).json({ success: false, message: "Device not found" });
        }

        const owner = await User.findById(device.owner);

        // Якщо у власника є активна підписка
        if (owner && owner.subscribeUser && owner.subscribeUser.endpoint) {
            
            // Функція-помічник для відправки конкретного алерта
            const triggerAlert = (title, body, icon, tag) => {
                sendNotification(owner.subscribeUser, {
                    title,
                    body,
                    icon,
                    tag, // Унікальний тег для кожного типу (temp/humi/co2)
                    data: { url: `/device/${deviceId}` }
                }).catch(err => console.error(`❌ Push error [${tag}]:`, err.message));
            };

            // 1. Перевірка Температури
            if (device.temperature > 30) {
                triggerAlert(
                    "🌡️ Висока температура!", 
                    `Зафіксовано: ${device.temperature}°C. Перевірте приміщення.`,
                    "/assets/icons/temp-high.png",
                    "alert-temp"
                );
            } else if (device.temperature < 10) {
                triggerAlert(
                    "❄️ Низька температура!", 
                    `Зафіксовано: ${device.temperature}°C. Дуже холодно.`,
                    "/assets/icons/temp-low.png",
                    "alert-temp"
                );
            }

            // 2. Перевірка CO2
            if (device.co2 > 1000) {
                triggerAlert(
                    "🌬️ Рівень CO2 перевищено!", 
                    `Поточний рівень: ${device.co2} ppm. Треба провітрити!`,
                    "/assets/icons/co2-warning.png",
                    "alert-co2"
                );
            }

            // 3. Перевірка Вологості
            if (device.humidity < 30) {
                triggerAlert(
                    "💧 Низька вологість!", 
                    `Вологість впала до ${device.humidity}%. Повітря занадто сухе.`,
                    "/assets/icons/humidity.png",
                    "alert-humi"
                );
            } else if (device.humidity > 70) {
                triggerAlert(
                    "💦 Висока вологість!", 
                    `Вологість піднялась до ${device.humidity}%. Повітря занадто вологе.`,
                    "/assets/icons/humidity.png",
                    "alert-humi"
                );
            }
        }

        return res.status(200).json({
            success: true,
            data: [{
                temperature: device.temperature,
                humidity: device.humidity,
                co2: device.co2
            }]
        });

    } catch (error) {
        console.error('❌ Помилка:', error);
        return res.status(500).json({ success: false, message: 'Внутрішня помилка сервера' });
    }
};

export const doorStatus = async (req, res) => {
  const { deviceId } = req.params;
  
  try {
    const device = await Device.findOne({ deviceId });
    if (!device) {
      return res.status(404).json({ success: false, message: 'Пристрій не знайдено' });
    }
    return res.status(200).json({
      success: true,
      status: device.status
    });
  } catch (error) {
    console.error('❌ Помилка отримання статусу дверей:', error);
    return res.status(500).json({ success: false, message: 'Внутрішня помилка сервера' });
  }
};

export const updateDoorStatus = async (req, res) => {
  const { deviceId } = req.params;
  try {
    const device = await Device.findOne({ deviceId });
    if (!device) {
      return res.status(404).json({ success: false, message: 'Пристрій не знайдено' });
    }

    device.status = !device.status;
    await device.save();

    return res.status(200).json({
      success: true,
      status: device.status ? "Відчинено" : "Зачинено"
    });

  } catch (error) {
    console.error('❌ Помилка оновлення статусу дверей:', error);
    return res.status(500).json({ success: false, message: 'Внутрішня помилка сервера' });
  }
};

export const isAlert = async (req, res) => {
  const { deviceId } = req.params;
  try {
    const device = await Device.findOne({ deviceId });
    if (!device) {
      return res.status(404).json({ success: false, message: 'Пристрій не знайдено' });
    }
    return res.status(200).json({ success: true, alert: device.alert, status: device.status });
  } catch (error) {
    console.error('❌ Помилка отримання тривоги пристрою:', error);
    return res.status(500).json({ success: false, message: 'Внутрішня помилка сервера' });
  }
};