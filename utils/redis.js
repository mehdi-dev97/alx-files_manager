import { createClient } from 'redis';
import { promisify } from 'util';

/**
 * Redis client
 */
class RedisClient {
  /**
   * Create new redis connection
   */
  constructor() {
    this.connetcted = true;
    this.client = createClient({
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
    });
    this.client.on('error', (error) => {
      this.connetcted = false;
      console.log(`Redis connection failed : ${error.toString()}`);
    });
    this.client.on('connect', () => {
      this.connetcted = true;
    });
  }

  /**
   * Get Redis connection status
   * @returns {Boolean}
   */
  isAlive() {
    return this.connetcted;
  }

  /**
   * Get Redis value
   * @param {String} key
   * @returns {String | Object}
   */
  async get(key) {
    return promisify(this.client.GET).bind(this.client)(key);
  }

  /**
   * Set Redis value
   * @param {String} key
   * @param {Number} duration
   * @param {String} value
   * @returns {Promise}
   */
  async set(key, duration, value) {
    await promisify(this.client.SETEX).bind(this.client)(key, duration, value);
  }

  /**
   * Delete Redis value
   * @param {String} key
   * @returns {Promise}
   */
  async del(key) {
    await promisify(this.client.DEL).bind(this.client)(key);
  }
}

export const redisClient = new RedisClient();
export default redisClient;
