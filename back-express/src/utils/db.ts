//config/config.ts
import dotenv from 'dotenv';
import { ConnectionOptions } from "mysql2";
import mysql from "mysql2/promise"
dotenv.config();

var db_info: ConnectionOptions = {
  host: "db",
  port: Number(process.env.DB_PORT)!,
  user: process.env.MYSQL_USER!,
  password: process.env.MYSQL_PASSWORD!,
  database: process.env.MYSQL_DATABASE,
};

export const pool = mysql.createPool(db_info)

