import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import 'dotenv/config';
import cookieParser from 'cookie-parser';
import connectDB from './config/mongodb.js';
import authRouter from './routes/authRoutes.js';
import userRouter from './routes/userRoudes.js';
import deviceRoutes from './routes/deviceRoutes.js';

const app = express();
const PORT = process.env.PORT || 4000;
connectDB();

app.use(express.json());

// CORS налаштування
const allowedOrigins = [
  "http://localhost:4000",
  "https://safepoint-bei0.onrender.com"
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

app.use(cookieParser({Credentials: true}));


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
  console.log(`Сервер працює на http://localhost:${PORT}`);
});