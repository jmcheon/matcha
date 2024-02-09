// db/dbConfig.ts
import { createPool, Pool } from 'mysql2/promise'

export const dbConfig: Pool = createPool({
  host: 'db',
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_ROOT_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  port: parseInt(process.env.MYSQL_PORT),
})
