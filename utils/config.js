import dotenv from "dotenv"
import Pg from "pg";
dotenv.config();

let PORT = process.env.PORT;
let JWT_SECRET = process.env.JWT_SECRET


const poolConfig = {
  user: 'postgres',
  host: 'localhost',
  database: 'coaching_V2',
  password: 'secret',
  port: 5430,
};

const pool = new Pg.Pool(poolConfig)

export { pool, PORT, JWT_SECRET };
