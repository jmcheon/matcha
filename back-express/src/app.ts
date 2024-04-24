import express, { Express } from 'express';

import swaggerUi from 'swagger-ui-express';
import swaggerFile from "./swagger/swagger-output.json"
import genSwagger from './swagger';

import dotenv from 'dotenv';
dotenv.config()

const app: Express = express();
const port: number = Number(process.env.BACK_PORT) || 3005;


// generate swagger-output.json every time when the app is deployed
genSwagger()

app.use(express.json())
app.use("/swagger", swaggerUi.serve, swaggerUi.setup(swaggerFile));

// Your other Express app configurations and route setups
app.get('/', (req, res) => {
  res.send('Hello Worl2d');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`)
});
