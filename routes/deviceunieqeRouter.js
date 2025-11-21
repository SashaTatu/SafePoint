import express from 'express';
import { deviceParameterPost, deviceParameterGet, GetDeviceById } from '../controllers/deviceunieqeController.js';

const deviceunieqeRoutes = express.Router();


deviceunieqeRoutes.post('/device/:deviceId/parameterspost', deviceParameterPost);
deviceunieqeRoutes.get('/device/:deviceId/parametersget', deviceParameterGet);
deviceunieqeRoutes.get('/getId', GetDeviceById);

export default deviceunieqeRoutes;
