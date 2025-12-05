import axios from "axios";

const token = process.env.UKRAINE_ALARM_TOKEN;

export async function checkRegionAlarm(regionId) {
  try {
    const url = `https://api.ukrainealarm.com/api/v3/alerts/${regionId}`;

    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("UkraineAlarm ERROR:", regionId, error.response?.status);
    return null;
  }
}



export default checkRegionAlarm;