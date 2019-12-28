import { PubSub } from 'apollo-server'
import { RedisPubSub } from 'graphql-redis-subscriptions'

import { getRedisClient } from './redis'
import { inProduction } from '../env'

const productionPubSub = () =>
  new RedisPubSub({
    publisher: getRedisClient(),
    subscriber: getRedisClient()
  })

export const pubsub = inProduction ? productionPubSub() : new PubSub()
