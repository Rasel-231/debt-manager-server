import { RedisService } from './redis';

interface IMemoryEntry {
  value: string;
  expiresAt: number;
}

const memoryStore = new Map<string, IMemoryEntry>();

const isExpired = (entry: IMemoryEntry): boolean =>
  entry.expiresAt > 0 && entry.expiresAt < Date.now();

export const tokenStore = {
  async get(key: string): Promise<string | null> {
    if (RedisService.isReady()) {
      return RedisService.client.get(key);
    }
    const entry = memoryStore.get(key);
    if (!entry) return null;
    if (isExpired(entry)) {
      memoryStore.delete(key);
      return null;
    }
    return entry.value;
  },

  async set(key: string, value: string, ttlSeconds: number): Promise<void> {
    if (RedisService.isReady()) {
      await RedisService.client.set(key, value, 'EX', ttlSeconds);
      return;
    }
    memoryStore.set(key, { value, expiresAt: Date.now() + ttlSeconds * 1000 });
  },

  async del(key: string): Promise<void> {
    if (RedisService.isReady()) {
      await RedisService.client.del(key);
      return;
    }
    memoryStore.delete(key);
  },
};
