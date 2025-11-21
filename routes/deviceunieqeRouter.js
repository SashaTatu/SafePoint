import express from 'express';
import { deviceParameter, GetDeviceById} from '../controllers/deviceunieqeController.js';
import userAuth from '../middleware/userAuth.js';

const deviceunieqeRoutes = express.Router();

deviceunieqeRoutes.get('/parameters', userAuth, deviceParameter);
deviceunieqeRoutes.get('/getId', GetDeviceById);

export default deviceunieqeRoutes;