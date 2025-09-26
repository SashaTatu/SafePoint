import express from 'express';
import { addDevice, registerDevice, deleteDevice, ShowAllDevices} from '../controllers/deviceController.js';
import userAuth from '../middleware/userAuth.js';

const deviceRoutes = express.Router();

deviceRoutes.post('/register', registerDevice);
deviceRoutes.post('/add', userAuth, addDevice);
deviceRoutes.delete('/delete',  deleteDevice);
deviceRoutes.get('/data', userAuth, ShowAllDevices);

export default deviceRoutes;
