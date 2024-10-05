import express, { Express } from 'express';

import dotenv from 'dotenv';
import accountRoutes from './routes/account.routes';
import authRoutes from './routes/auth.routes';
import profileRoutes from './routes/profile.routes';
import cookieParser from 'cookie-parser';
import axios from 'axios';
import jwt from 'jsonwebtoken';
import passport from 'passport'
import cors from 'cors';
import requestIp from 'request-ip';
import fileUpload from 'express-fileupload';

import passportConfig from './passport'

import session from 'express-session';


dotenv.config()

const app: Express = express();
const port: number = Number(process.env.BACK_PORT);
passportConfig()
app.use(cors({
  origin: 'http://localhost:8080', // or '*' to allow all origins (use this with caution)
  credentials: true
}));

app.use(session({
  secret: process.env.SESSION_SECRET as string, // Replace with your own secret
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } // Set to true if you're using HTTPS
}));

app.use(cookieParser());
app.use(express.json())
app.use(fileUpload())
app.use(requestIp.mw());

app.use(passport.initialize())
app.use(passport.session())

// Your other Express app configurations and route setups
app.get('/', (req, res) => {
  res.send('Hello World');
});
app.use('/', authRoutes);
app.use('/api', accountRoutes);
app.use('/api/profile', profileRoutes);

// Allow requests from your frontend (localhost:8080 or wherever your frontend is running)
app.use(cors({
  origin: 'http://localhost:8080' // or '*' to allow all origins (use this with caution)
}));

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`)
});
