import 'dotenv/config';
import { defineConfig } from '@prisma/config'; // Импорт из нового пакета

export default defineConfig({
  schema: './prisma/schema.prisma',
  datasource: {
    url: process.env.DATABASE_URL
  }
});