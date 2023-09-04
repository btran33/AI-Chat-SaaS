import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

/**
 * A rate limiter to Redis chat history
 * @param identifier the identifier (url + userId) in string
 * @returns 
 */
export async function rateLimit(identifier: string){
    // 1 request per second
    const rateLimit = new Ratelimit({
        redis: Redis.fromEnv(),
        limiter: Ratelimit.slidingWindow(10, '10 s'),
        analytics: true,
        prefix: '@upstas/ratelimit'
    });

    return await rateLimit.limit(identifier);
}