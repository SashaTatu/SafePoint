import axios from "axios";

export async function checkRegionAlarm(uid) {
    try {
        const response = await axios.get(`https://api.ukrainealarm.com/api/v3/alerts/${uid}`, {
            headers: {
                accept: "application/json",
                Authorization: process.env.ALARM_TOKEN  
            }
        });

        return response.data;
    } catch (error) {
        console.log("UkraineAlarm ERROR:", uid, error.response?.status);
        return null;
    }
}


export default checkRegionAlarm;