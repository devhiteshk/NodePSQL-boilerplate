import express from "express"
import cors from "cors"
import { tokenExtractor } from "./middleware/middleware.js";
import { connectRedis } from "./cache/Redis.js";
import { connectPostgres, pool } from "./db/db.js";
import { error, info } from "./logger/logger.js";


const app = express();
connectRedis();
connectPostgres();

const result = await pool.query("SELECT NOW()");
info(`Database time is: ${result.rows[0].now}`);

app.options("*", cors());
app.use(express.json());
app.use(tokenExtractor)

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to my Express.js app!' });
});

export default app
