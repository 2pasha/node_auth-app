import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import { authRouter } from './routes/auth.route.js';
import { userRouter } from './routes/user.route.js';
import { errorMiddleware } from './middleware/errorMiddleware.js';

const PORT = process.env.PORT || 3005;

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use(cors({
  origin: process.env.CLIENT_HOST,
  credentials: true
}));

app.use(authRouter);
app.use('/users', userRouter);

app.get('/', (req, res) => {
  res.send('hello from server side');
});

app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`server is running on http://localhost:${PORT}`);
});

