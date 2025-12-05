import axios from "axios";

const clientId = process.env.UA_CLIENT_ID;
const clientSecret = process.env.UA_CLIENT_SECRET;

const auth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

export async function checkRegionAlarm(regionId) {
  try {
    const url = `https://api.ukrainealarm.com/api/v3/alerts/${regionId}`;

    const resp = await axios.get(url, {
      headers: {
        Authorization: `Basic ${auth}`,
      },
    });

    return resp.data;
  } catch (err) {
    console.log("UkraineAlarm ERROR:", regionId, err.response?.status);
    return null;
  }
}




export default checkRegionAlarm;