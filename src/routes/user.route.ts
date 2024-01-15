import express from 'express';
import { UserController } from '../controllers';

const app = express();
const { getAllUsers, updateUser, deleteUser, getUser } = new UserController();

app.get('/:userId', getUser);
app.get('/', getAllUsers);
app.patch('/update/:userId', updateUser);
app.delete('/delete/:userId', deleteUser);

export default app;
