import express from 'express';
import { Request, Response } from 'express';

const app = express();
const port = 3000;

app.get('/', (req: Request, res: Response) => {
  res.send('Express back with Typescript!');
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

