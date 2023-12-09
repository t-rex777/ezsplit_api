import express from 'express';
import { UserController } from '../controllers';

const app = express();
const { login, register, getAllUsers, updateUser, deleteUser, getUser } = new UserController();

app.get('/:userId', getUser);
app.get('/', getAllUsers);
app.post('/login', login);
app.post('/register', register);
app.patch('/update/:userId', updateUser);
app.delete('/delete/:userId', deleteUser);

export default app;
