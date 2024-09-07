//config/config.ts
import dotenv from 'dotenv';
import { createConnection, Connection, ConnectionOptions } from "mysql2";
dotenv.config();

var db_info: ConnectionOptions = {
  host: "db",
  port: Number(process.env.DB_PORT)!,
  user: process.env.MYSQL_USER!,
  password: process.env.MYSQL_PASSWORD!,
  database: process.env.MYSQL_DATABASE,
};

function init(): Connection {
  return createConnection(db_info);
}

function connect(conn: { connect: (arg0: (err: any) => void) => void }) {
  conn.connect(function (err) {
    if (err) console.error("mysql connection error : " + err);
    else console.log("mysql is connected successfully!");
  });
}

export { init, connect };

