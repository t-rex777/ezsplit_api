import express from 'express';
import { userController } from '../controllers';

const app = express();
const { login, register, all, update } = new userController();

app.post('/login', login);
app.post('/register', register);
app.get('/users', all);
app.patch('/update/:userId', update);

export default app;
