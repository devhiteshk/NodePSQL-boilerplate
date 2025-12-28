import { defineConfig } from 'prisma/config';
import { DATABASE_URL } from './utils/config';

if (!DATABASE_URL) throw new Error('DATABASE_URL is not set in env');

export default defineConfig({
  datasource: {
    url: DATABASE_URL,
  },
  migrate: {
    datasourceUrl: DATABASE_URL,
  },
});
