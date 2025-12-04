import axios from "axios";
import userModel from '../models/userModel.js';
import { regionUID } from "../config/regionUID.js";


export async function checkRegionAlarm(regionSlug) {
    try {
        const uid = regionUID[regionSlug];
        if (!uid) return null;

        const response = await axios.get(`${ALERT_API_URL}/${uid}`, {
            headers: {
                Authorization: `Bearer ${process.env.ALERT_API_TOKEN}`
            }
        });

        return response.data; // Повертає статус тривоги
    } catch (error) {
        console.error("Помилка UkraineAlarm:", error.response?.data || error);
        return null;
    }
}

export default checkRegionAlarm;