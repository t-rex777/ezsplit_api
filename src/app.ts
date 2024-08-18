import bodyParser from 'body-parser';
import 'dotenv/config';
import express from 'express';
import { UserController } from './controllers';
import { authRoutes, categoryRoutes, groupExpenseRoutes, groupRoutes, userExpenseRoutes, userRoutes } from './routes';

const { isAuthorized } = new UserController();

const app = express();
const port = process.env.PORT || 8080;

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(bodyParser.json());

app.use('/api/users', authRoutes);
app.use('/api/users', isAuthorized, userRoutes);
app.use('/api/groups', isAuthorized, groupRoutes);
app.use('/api/expenses/group', isAuthorized, groupExpenseRoutes);
app.use('/api/expenses/user', isAuthorized, userExpenseRoutes);
app.use('/api/category', isAuthorized, categoryRoutes);

app.listen(port, () => {
  // eslint-disable-next-line no-console
  return console.log(`Express is listening at http://localhost:${port}`);
});
