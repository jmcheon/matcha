import express, { Express } from 'express';

import dotenv from 'dotenv';
import accountRoutes from './routes/account.routes';
import authRoutes from './routes/auth.routes';
import cookieParser from 'cookie-parser';
import axios from 'axios';
import jwt from 'jsonwebtoken';

import cors from 'cors';

import { getAccountBySocial } from './services/account.service';

dotenv.config()


const app: Express = express();
const port: number = Number(process.env.BACK_PORT) || 3005;

app.use(cors({
  origin: 'http://localhost:8080', // or '*' to allow all origins (use this with caution)
  credentials: true
}));

app.use(cookieParser());
app.use(express.json())

// Your other Express app configurations and route setups
app.get('/', (req, res) => {
  res.send('Hello World');
});
app.use('/', authRoutes);
app.use('/api', accountRoutes);

interface GoogleTokenResponse {
  id_token: string;
  access_token: string;
}

interface DecodedIdToken {
  email?: string;
  [key: string]: any; // Other possible properties
}

// Allow requests from your frontend (localhost:8080 or wherever your frontend is running)
app.use(cors({
  origin: 'http://localhost:8080' // or '*' to allow all origins (use this with caution)
}));

// app.get('/auth/google/callback', async (req, res) => {
//   const authorizationCode = req.query.code as string;

//   try {
//     // Exchange the authorization code for tokens
//     const response = await axios.post<GoogleTokenResponse>('https://oauth2.googleapis.com/token', {
//       code: authorizationCode,
//       client_id: clientId,
//       client_secret: clientSecret,
//       redirect_uri: redirectUri,
//       grant_type: 'authorization_code',
//     });

//     const { id_token, access_token } = response.data;

//     // Decode the ID token to get the user's email
//     const decodedIdToken = jwt.decode(id_token) as DecodedIdToken;

//     const userEmail = decodedIdToken?.email; // Email is available here

//     if (!userEmail) {
//       return res.status(400).json({ message: 'Email not found in ID token' });
//     }

//     const user = await getAccountBySocial("google", userEmail);
//     // Use the tokens and email as needed
//     if (user) {
//       // User exists, proceed with login (e.g., generate a session or JWT)
//       res.json({
//         message: 'Login successful',
//         user: {
//           email: user.email,
//           name: user.email,
//         },
//       });
//     } else {
//       // User does not exist, send response to frontend to generate a new user
//       const frontendUrl = "http://localhost:3000/";

//       res.redirect(frontendUrl);
//     }

//     // Normally, you'd verify the ID token here and establish a session for the user
//   } catch (error) {
//     console.error('Error exchanging authorization code for tokens:', error);
//     res.status(500).send('Authentication failed');
//   }
// });

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`)
});
