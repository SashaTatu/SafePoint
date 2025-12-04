import axios from "axios";
import { regionUID } from "../utils/regionUID.js";

const API_URL = "https://api.ukrainealarm.com/api/v3/alerts/region";

export async function checkRegionAlarm(regionSlug) {
    try {
        const uid = regionUID[regionSlug];
        if (!uid) return null;

        const response = await axios.get(`${API_URL}/${uid}`, {
            headers: {
                Authorization: `Bearer ${process.env.ALARM_TOKEN}`
            }
        });

        return response.data; // Повертає статус тривоги
    } catch (error) {
        console.error("Помилка UkraineAlarm:", error.response?.data || error);
        return null;
    }
}
export default checkRegionAlarm;