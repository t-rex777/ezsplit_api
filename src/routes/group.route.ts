import express from 'express';
import { GroupController } from '../controllers/group.controller';

const app = express();
const { createGroup, deleteGroup, getGroupById, getAllGroups, updateGroup, addUsersToGroup } = new GroupController();

app.get('/:groupId', getGroupById);
app.get('/', getAllGroups);
app.post('/create', createGroup);
app.post('/add-users/:groupId', addUsersToGroup);
app.patch('/update/:groupId', updateGroup);
app.patch('/update/:userId', updateGroup);
app.delete('/delete', deleteGroup);

export default app;
