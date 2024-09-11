import { pool } from '../utils/db';
import { Account } from '../models/account.model';
const jwt = require('jsonwebtoken');
import { Request, Response } from 'express';
import { RowDataPacket } from 'mysql2';

// Assuming you already have a JWT/Auth utility for accessing the current user's account_id

export const generateProfile = async (req: Request, res: Response): Promise<Response> => {
  let access_token = req.cookies['accessToken'];
  if (!access_token) {
    console.log("here")
    return res.json({ error: 'refresh_token not exist' });
  }
  try {
    const user: any = await jwt.verify(access_token, process.env.JWT_SECRET as string);
    const account_id = user.userId; // Assuming req.user is populated via authentication middleware
    const {
      firstName: first_name,
      lastName: last_name,
      location,
      gender,
      iLike: like_gender,
      height,
      user_language,
      interests,
      bio
    } = req.body;
    // Validate input
    if (!first_name || !last_name || !location || !gender || !like_gender || !height || !bio) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Check if account exists
    const [accountRows] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM account WHERE account_id = ? LIMIT 1',
      [account_id]
    );
    if (accountRows.length === 0) {
      return res.status(404).json({ error: 'Account not found' });
    }

    // Check if a profile already exists for this account
    const [profileCheck] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM profile WHERE account_id = ? LIMIT 1',
      [account_id]
    );

    if (profileCheck.length > 0) {
      return res.status(400).json({ error: 'Profile already exists for this account' });
    }

    // Insert new profile
    const [insertResult] = await pool.query('INSERT INTO profile (account_id, first_name, last_name, location, gender, like_gender, height, user_language, interests, bio) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [
      account_id,
      first_name,
      last_name,
      location,
      gender,
      like_gender,
      height,
      user_language,
      interests, // This can be a comma-separated string, e.g. "music,travel"
      bio,
    ]);

    // Check if the profile was successfully created
    if (!insertResult) {
      return res.status(500).json({ error: 'Profile creation failed' });
    }

    // Return the created profile
    const [newProfile] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM profile WHERE account_id = ? LIMIT 1',
      [account_id]
    );
    console.log("checker 2", newProfile[0])
    return res.status(201).json(newProfile[0]);
  } catch (error) {
    console.error('Error generating profile:', error);
    return res.status(500).json({ error: 'An error occurred while generating the profile' });
  }
};
