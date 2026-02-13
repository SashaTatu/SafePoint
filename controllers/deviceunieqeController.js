import mongoose from 'mongoose';
import jwt from "jsonwebtoken";
import User from '../models/userModel.js';
import Device from '../models/deviceModel.js';
import { sendAndSaveNotification } from '../services/pushService.js';
import DeviceLog from '../models/DeviceLogModel.js';

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
    return res.status(400).json({ success: false, message: "Missing data" });
  }

  try {
    const device = await Device.findOne({ deviceId });
    if (!device) return res.status(404).json({ success: false, message: "Device not found" });

    // 1. Оновлюємо ПОТОЧНІ значення (для картки)
    device.temperature = temperature;
    device.humidity = humidity;
    device.co2 = co2;
    device.updatedAt = new Date();
    await device.save();

    // 2. Записуємо в ІСТОРІЮ (для графіка)
    await DeviceLog.create({
      deviceId,
      temperature,
      humidity,
      co2
    });

    return res.status(200).json({ success: true, message: "Data saved in state and history" });
  } catch (error) {
    console.error("❌ SERVER ERROR:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};


export const deviceParameterGet = async (req, res) => {
    const { deviceId } = req.params;
    const ALERT_INTERVAL = 10 * 60 * 1000; // 10 хвилин

    try {
        const device = await Device.findOne({ deviceId });
        if (!device) return res.status(404).json({ success: false, message: "Device not found" });

        const owner = await User.findById(device.owner);
        const now = Date.now();

        if (owner && owner.subscribeUser?.endpoint) {
            
            const processAlert = async (category, title, body, icon) => {
                const lastSent = device.lastAlerts?.[category] || 0;
                
                if (now - new Date(lastSent).getTime() > ALERT_INTERVAL) {
                    const payload = {
                        title,
                        // Додаємо ID пристрою на початку повідомлення
                        body: `Пристрій ${deviceId}: ${body}`, 
                        icon,
                        tag: `alert-${category}-${deviceId}`, // додаємо ID в тег, щоб алерти різних пристроїв не заміняли один одного
                        data: { url: `/device/${deviceId}` }
                    };

                    await sendAndSaveNotification(owner, payload, category);

                    await Device.updateOne(
                        { _id: device._id },
                        { [`lastAlerts.${category}`]: new Date() }
                    );
                    
                    console.log(`✅ Відправлено алерт для ${deviceId}: ${category}`);
                }
            };

            // --- БЛОК ПЕРЕВІРОК ---

            // 1. Температура
            if (device.temperature > 30) {
                await processAlert("temp", "🌡️ Висока температура!", `Зафіксовано: ${device.temperature}°C`, "/assets/icons/temp-high.png");
            } else if (device.temperature < 10) {
                await processAlert("temp", "❄️ Низька температура!", `Зафіксовано: ${device.temperature}°C`, "/assets/icons/temp-low.png");
            }

            // 2. CO2
            if (device.co2 > 1000) {
                await processAlert("co2", "🌬️ Рівень CO2 перевищено!", `Рівень: ${device.co2} ppm. Провітріть!`, "/assets/icons/co2-warning.png");
            }

            // 3. Вологість
            if (device.humidity < 30) {
                await processAlert("humi", "💧 Низька вологість!", `Вологість: ${device.humidity}%. Занадто сухо.`, "/assets/icons/humidity.png");
            } else if (device.humidity > 70) {
                await processAlert("humi", "💦 Висока вологість!", `Вологість: ${device.humidity}%. Занадто волого.`, "/assets/icons/humidity.png");
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
        console.error('❌ Помилка в deviceParameterGet:', error);
        return res.status(500).json({ success: false, error: error.message });
    }
};




/////////////////////////////////////////////////////////////////////////

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

/////////////////////////////////////////////////////////////////////////






export const getDeviceHistory = async (req, res) => {
    const { deviceId } = req.params;
    try {
        const history = await DeviceLog.find({ deviceId })
            .sort({ timestamp: -1 }) // Спочатку найновіші
            .limit(50); // Беремо останні 50 точок
            
        res.json({ success: true, data: history.reverse() }); // Повертаємо у хронологічному порядку
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};