import express from 'express';
import { UserController } from '../controllers';

const app = express();
const { login, register, refreshToken } = new UserController();

app.post('/login', login);
app.post('/register', register);
app.post('/refresh', refreshToken);

export default app;
