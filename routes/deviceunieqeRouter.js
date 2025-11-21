import express from 'express';
import { deviceParameterPost, deviceParameterGet, GetDeviceById} from '../controllers/deviceunieqeController.js';
import userAuth from '../middleware/userAuth.js';

const deviceunieqeRoutes = express.Router();

deviceunieqeRoutes.post('/parameterspost', userAuth, deviceParameterPost);
deviceunieqeRoutes.get('/parametersget', userAuth, deviceParameterGet);
deviceunieqeRoutes.get('/getId', GetDeviceById);

export default deviceunieqeRoutes;