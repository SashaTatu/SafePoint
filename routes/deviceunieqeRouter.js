import express from 'express';
import { deviceParameterPost, deviceParameterGet, GetDeviceById } from '../controllers/deviceunieqeController.js';

const deviceunieqeRoutes = express.Router();


deviceunieqeRoutes.post('/parameterspost', deviceParameterPost);
deviceunieqeRoutes.get('/parametersget', deviceParameterGet);
deviceunieqeRoutes.get('/getId', GetDeviceById);

export default deviceunieqeRoutes;
