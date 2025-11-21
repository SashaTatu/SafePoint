import express from 'express';
import { deviceParameterPost, deviceParameterGet, GetDeviceById } from '../controllers/deviceunieqeController.js';

const deviceunieqeRoutes = express.Router();


deviceunieqeRoutes.get('/:deviceId/parametersget', deviceParameterGet);
deviceunieqeRoutes.post('/:deviceId/parameterspost', deviceParameterPost);
deviceunieqeRoutes.get('/:deviceId/getId', GetDeviceById);

export default deviceunieqeRoutes;
