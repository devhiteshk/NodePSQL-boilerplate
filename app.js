import express from "express"
import cors from "cors"
import { tokenExtractor } from "./middleware/middleware.js";
import { connectRedis } from "./cache/Redis.js";

const app = express();
connectRedis();

app.options("*", cors());
app.use(express.json());
app.use(tokenExtractor)

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to my Express.js app!' });
});

export default app
