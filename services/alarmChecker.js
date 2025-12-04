const axios = require("axios");

async function checkRegionAlarm(regionId) {
    try {
        const token = process.env.ALERT_API_TOKEN;

        const response = await axios.get("https://api.ukrainealarm.com/api/v3/alerts", {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });

        const regions = response.data;

        // знайти твою область
        return regions.find(r => r.regionId === regionId);
    } catch (err) {
        console.error("Помилка UkraineAlarm:", err);
        return null;
    }
}


export default checkRegionAlarm;