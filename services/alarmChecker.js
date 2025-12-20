import axios from "axios";

export async function checkRegionAlarm() {
    try {
        const response = await axios.get('https://api.ukrainealarm.com/api/v3/alerts', {
            headers: {
                accept: "application/json",
                Authorization: process.env.ALARM_TOKEN  
            }
        });

        return response.data;
    } catch (error) {
        console.error("❌ Помилка отримання тривог:", error);
        return null;
    }
}


export default checkRegionAlarm;