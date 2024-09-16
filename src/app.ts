import '../env.helper';

import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import morgan from 'morgan';

import { UserController } from './controllers';
import { authRoutes, categoryRoutes, groupExpenseRoutes, groupRoutes, userExpenseRoutes, userRoutes } from './routes';

const { isAuthorized } = new UserController();

const app = express();
const hostname = '0.0.0.0';
const port = Number(process.env.PORT) || 3000;

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(bodyParser.json());

//? loggers
app.use(morgan(':method :url :status :response-time ms - :res[content-length]'));

app.use((req, res, next) => {
  // eslint-disable-next-line no-console
  console.log('\x1b[33m' + '[REQUEST_BODY]: ' + JSON.stringify(req.body) + '\x1b[0m');

  next();
});

app.use('/api/users', authRoutes);
app.use('/api/users', isAuthorized, userRoutes);
app.use('/api/groups', isAuthorized, groupRoutes);
app.use('/api/expenses/group', isAuthorized, groupExpenseRoutes);
app.use('/api/expenses/user', isAuthorized, userExpenseRoutes);
app.use('/api/category', isAuthorized, categoryRoutes);

process.on('uncaughtException', (err) => {
  // eslint-disable-next-line no-console
  console.log(err);
});

app.listen(port, hostname, () => {
  // eslint-disable-next-line no-console
  console.log(`Server running at http://${hostname}:${port}/`);
});
