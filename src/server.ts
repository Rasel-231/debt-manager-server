import { Server } from 'http';
import app from './app';
import config from './config';
import { RedisService } from './shared/redis';

async function myserver() {
  let server: Server;
  try {
    await RedisService.connectRedis();
  } catch (err) {
    console.warn('Redis not reachable — continuing with in-memory token store', err);
  }

  try {
    server = app.listen(config.port, () => {
      console.log(` Debt Manager API is running on port: ${config.port}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
  }
}

myserver();
