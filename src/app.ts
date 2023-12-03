import bodyParser from 'body-parser';
import 'dotenv/config';
import express from 'express';
import { userRoutes } from './routes';

const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(bodyParser.json());
app.use('/api', userRoutes);

app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});
