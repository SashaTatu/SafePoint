import express from 'express';
import { deviceParameterPost, deviceParameterGet, GetDeviceById, doorStatus, updateDoorStatus, isAlert, getDeviceHistory } from '../controllers/deviceunieqeController.js';



const deviceunieqeRoutes = express.Router({ mergeParams: true });


deviceunieqeRoutes.get('/:deviceId/parametersget', deviceParameterGet);
deviceunieqeRoutes.post('/:deviceId/parameterspost', deviceParameterPost);
deviceunieqeRoutes.get('/:deviceId/getId', GetDeviceById);
deviceunieqeRoutes.get('/:deviceId/doorstatus', doorStatus);
deviceunieqeRoutes.post('/:deviceId/updatedoorstatus', updateDoorStatus);
deviceunieqeRoutes.get('/:deviceId/isalert', isAlert);
deviceunieqeRoutes.get('/:deviceId/history', getDeviceHistory);

export default deviceunieqeRoutes;
