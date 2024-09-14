import { getAccountById, updateAccountStatus } from '../models/account.model';
const jwt = require('jsonwebtoken');
import { Request, Response } from 'express';
import { createProfile, getProfileByAccountId, Profile } from '../models/profile.model';

export const generateProfile = async (req: Request, res: Response): Promise<Response> => {
  //TODO: remove
  const access_token = req.cookies['accessToken'];
  if (!access_token) {
    console.log('Access token not found');
    return res.status(401).json({ error: 'Access token not provided' });
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
    const account = await getAccountById(account_id);
    if (!account) {
      return res.status(404).json({ error: 'Account not found' });
    }

    // Check if a profile already exists for this account
    const existingProfile = await getProfileByAccountId(account_id);
    if (existingProfile) {
      return res.status(400).json({ error: 'Profile already exists for this account' });
    }

    // Create new profile data
    const profileData: Profile = {
      account_id,
      first_name,
      last_name,
      location,
      gender,
      like_gender,
      height,
      user_language,
      interests,
      bio,
    };

    const insertResult = await createProfile(profileData);
    await updateAccountStatus(account_id, "online");

    // Check if the profile was successfully created
    if (!insertResult || insertResult.affectedRows === 0) {
      return res.status(500).json({ error: 'Profile creation failed' });
    }

    // Retrieve and return the created profile
    const newProfile = await getProfileByAccountId(account_id);
    return res.status(201).json(newProfile);

  } catch (error) {
    console.error('Error generating profile:', error);
    return res.status(500).json({ error: 'An error occurred while generating the profile' });
  }
};
