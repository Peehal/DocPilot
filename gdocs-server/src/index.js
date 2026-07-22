import express from 'express';
import cors from 'cors';
import { clerkMiddleware } from '@clerk/express';
import { env } from './config/env.js';
import { connectDB } from './config/db.js';
import routes from './routes/index.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();

app.use(cors({ origin: env.clientUrl, credentials: true }));
app.use(express.json());
app.use(clerkMiddleware());

app.use('/api', routes);

app.use(errorHandler);

connectDB()
  .catch((err) => console.error('[db] connection failed', err))
  .finally(() => {
    app.listen(env.port, () => console.log(`[server] listening on port ${env.port}`));
  });
