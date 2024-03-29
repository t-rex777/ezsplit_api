import express from 'express';
import { UserController } from '../controllers';

const app = express();
const { getAllUsers, updateUser, deleteUser, getUser, isAuthorized } = new UserController();

app.get('/current', isAuthorized, getUser);
app.get('/all', getAllUsers);
app.patch('/update/:userId', updateUser);
app.delete('/delete/:userId', deleteUser);

export default app;
