import { createClient } from 'redis';
import * as logger from "../logger/logger.js"

const redisClient = createClient({
  host: process.env.REDIS_HOST || 'localhost', // Replace with actual Redis host if using a service
  port: process.env.REDIS_PORT || 6379, // Default Redis port
  password: process.env.password || ""
});

// Handle Redis client errors
redisClient.on('error', (err) => {
  logger.error(`Redis error: ${err}`);
});

// Connect to Redis server
const connectRedis = async () => {
  try {
    await redisClient.connect();
    logger.info("Connected to Redis successfully");
  } catch (err) {
    logger.error("Failed to connect to Redis", err);
  }
};

// Export the Redis client and the connection function
export { redisClient, connectRedis };
