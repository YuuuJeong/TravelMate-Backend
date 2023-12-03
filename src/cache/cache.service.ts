import { Injectable } from '@nestjs/common';
import { RedisService } from 'src/redis/redis.service';

@Injectable()
export class CacheService {
  constructor(private readonly redis: RedisService) {}
  private readonly globalPrefix = 'cache';

  public async cacheOrFetch<T>(args: {
    cachePrefix: string;
    cacheKey: () => string;
    ttl?: number;
    fetch: () => Promise<T>;
    useCache: boolean;
  }) {
    const keyBase = `${this.globalPrefix}:${args.cachePrefix}`;

    if (!args.useCache) {
      return args.fetch();
    }

    const cacheKey = `${keyBase}:${args.cacheKey()}`;

    const cacheResult = await this.redis.get(cacheKey);

    if (!cacheResult) {
      const results = await args.fetch();
      const serializedResult = JSON.stringify(results);
      this.redis.set(cacheKey, serializedResult, args.ttl ?? 60);

      return results;
    }
    return JSON.parse(cacheResult);
  }

  public async setCache<T>(args: {
    cachePrefix: string;
    cacheKey: () => string;
    ttl?: number;
    fetch: () => Promise<T>;
  }) {
    const keyBase = `${this.globalPrefix}:${args.cachePrefix}`;

    const cacheKey = `${keyBase}:${args.cacheKey()}`;

    const results = await args.fetch();
    const serializedResult = JSON.stringify(results);
    this.redis.set(cacheKey, serializedResult, args.ttl ?? 60);

    return results;
  }
}
