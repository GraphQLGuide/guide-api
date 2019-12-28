import Redis from 'ioredis'
import { RedisCache } from 'apollo-server-cache-redis'

const { REDIS_HOST, REDIS_PORT, REDIS_PASSWORD } = process.env

const options = {
  host: REDIS_HOST,
  port: REDIS_PORT,
  password: REDIS_PASSWORD,
  retryStrategy: times => Math.min(times * 50, 1000)
}

export const getRedisClient = () => new Redis(options)

export const cache = new RedisCache(options)

export const USER_TTL = { ttl: 60 * 60 } // hour
