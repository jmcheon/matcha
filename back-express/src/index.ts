import express, { Request, Response } from "express";

const app = express();
const PORT = 3005;

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World! this is matcha back-express");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
