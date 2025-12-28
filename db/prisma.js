import { PrismaClient } from '@prisma/client';
import { DATABASE_URL } from '../utils/config';

const prisma = new PrismaClient({
  datasourceUrl: DATABASE_URL,
});

export default prisma;
