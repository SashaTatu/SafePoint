import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import 'dotenv/config';
import cookieParser from 'cookie-parser';
import connectDB from './config/mongodb.js';
import authRouter from './routes/authRouter.js';
import userRouter from './routes/userRouter.js';
import deviceRoutes from './routes/deviceRouter.js';

const app = express();
const PORT = process.env.PORT || 4000;
connectDB();



const allowedOrigins = [
  "http://localhost:3000",
  "https://safepoint-bei0.onrender.com",   // фронт на render
  "https://safepoint-api.onrender.com"     // бекенд (теж треба дозволити)
];


app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));

app.options(/.*/, cors({
  origin: allowedOrigins,
  credentials: true
}));


app.use(cookieParser());
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'enter.html'));
});

app.use('/api/auth', authRouter);

app.use('/api/user', userRouter);

app.use('/api/devices', deviceRoutes);



app.get('/main', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
});


app.use(express.static(path.join(__dirname, 'frontend')));
// Запуск сервера
app.listen(PORT, () => {
  console.log(`✅ Сервер працює на порті ${PORT}`);
});