import 'dotenv/config';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import { json } from 'body-parser';
import { createServer } from 'http';
import { registerRoutes } from './routes';
import { initQueues } from './queues/init';
import { errorHandler } from './middleware/error-handler';

const app = express();

app.use(helmet());
app.use(cors({ origin: process.env.WEB_ORIGIN?.split(',') ?? ['http://localhost:3000'] }));
app.use(json({ limit: '2mb' }));
app.use(morgan('tiny'));

registerRoutes(app);
app.use(errorHandler);

const server = createServer(app);
const port = process.env.PORT ?? 4000;

initQueues();

server.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`API listening on port ${port}`);
});
