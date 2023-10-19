import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Injectable, Inject } from '@nestjs/common';
import { RedisCache } from 'cache-manager-redis-yet';
import { RedisClientType } from 'redis';

@Injectable()
export class RedisService {
  private redisClient: RedisClientType;
  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheManager: RedisCache,
  ) {
    this.redisClient = cacheManager.store.client;
  }

  get(key) {
    return this.redisClient.get(key);
  }

  set(key, value, EX: number) {
    return this.redisClient.set(key, value, {
      EX,
    });
  }

  del(key) {
    return this.redisClient.del(key);
  }
}
