import dotenv from 'dotenv';
dotenv.config();

let PORT = process.env.PORT;
let JWT_SECRET = process.env.JWT_SECRET;

export { PORT, JWT_SECRET };
