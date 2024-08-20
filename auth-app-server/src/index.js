import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import { authRouter } from './routes/auth.route.js';

const PORT = process.env.PORT || 3005;

const app = express();
app.use(express.json());

app.use(cors({
  origin: process.env.CLIENT_HOST,
  credentials: true
}));

app.use(authRouter);

app.get('/', (req, res) => {
  res.send('hello from server side');
});

app.listen(PORT, () => {
  console.log(`server is running on http://localhost:${PORT}`);
});

