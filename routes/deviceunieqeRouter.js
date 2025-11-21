import express from 'express';
import { deviceParameterPost, deviceParameterGet, GetDeviceById } from '../controllers/deviceunieqeController.js';

const deviceunieqeRoutes = express.Router();


deviceunieqeRoutes.post('/device/:deviceId/parameters', deviceParameterPost);
deviceunieqeRoutes.get('/device/:deviceId/parameters', deviceParameterGet);
deviceunieqeRoutes.get('/getId', GetDeviceById);

export default deviceunieqeRoutes;
