import bodyParser from 'body-parser';
import 'dotenv/config';
import express from 'express';
import { UserController } from './controllers';
import { authRoutes, categoryRoutes, expenseRoutes, groupRoutes, userRoutes } from './routes';

const { isAuthorized } = new UserController();

const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(bodyParser.json());

app.use('/api/users', authRoutes);
app.use('/api/users', isAuthorized, userRoutes);
app.use('/api/groups', isAuthorized, groupRoutes);
app.use('/api/expenses', isAuthorized, expenseRoutes);
app.use('/api/category', isAuthorized, categoryRoutes);

app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});
