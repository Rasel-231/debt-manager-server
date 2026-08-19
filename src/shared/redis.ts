import { Redis } from 'ioredis';
import config from '../config';

const redisClient = new Redis(config.redis_url, {
  lazyConnect: true,
  maxRetriesPerRequest: 1,
  retryStrategy: (times) => Math.min(times * 200, 2000),
});

redisClient.on('error', (err) =>
  console.warn('Redis unavailable, falling back to in-memory store:', err.message)
);
redisClient.on('connect', () => console.log('Redis stream linked cache engine stable!'));

const connectRedis = async (): Promise<void> => {
  if (redisClient.status === 'end' || redisClient.status === 'close') {
    await redisClient.connect();
  }
};

const isReady = (): boolean => redisClient.status === 'ready';

export const RedisService = {
  connectRedis,
  isReady,
  client: redisClient,
};
