import dotenv from 'dotenv';
dotenv.config();

let PORT = process.env.PORT;
let JWT_SECRET = process.env.JWT_SECRET;
let DATABASE_URL = process.env.DATABASE_URL;

export { PORT, JWT_SECRET, DATABASE_URL };
