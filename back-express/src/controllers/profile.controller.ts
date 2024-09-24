import { getAccountById, updateAccountStatus } from '../models/account.model';
const jwt = require('jsonwebtoken');
import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { UploadedFile } from 'express-fileupload';
import { addProfileImage, createProfile, getProfileByAccountId, Profile } from '../models/profile.model';
import { randomBytes } from 'crypto';

const randomizeFileNameBase64 = (originalName: string): string => {
  // Generate random bytes and convert to Base64 (trim to 8 characters)
  const randomString = randomBytes(6).toString('base64').replace(/\W/g, '').slice(0, 8); // Only keep alphanumeric characters

  // Extract the file extension
  const fileExtension = path.extname(originalName);

  // Return the new file name with the random string and original file extension
  return `${randomString}${fileExtension}`;
};
export default class ProfileController {
  static async getProfile(req: Request, res: Response): Promise<Response> {
    // Extract the access token from cookies
    const access_token = req.cookies['accessToken'];
    if (!access_token) {
      console.log('Access token not found');
      return res.status(401).json({ code: 'GENERAL_ERROR' });
    }

    try {
      // Verify the access token
      const user: any = jwt.verify(access_token, process.env.JWT_SECRET as string);
      const account_id = user.accountId;

      // Retrieve the profile associated with the account_id
      const profileData = await getProfileByAccountId(account_id);
      if (!profileData) {
        return res.status(404).json({ code: 'PROFILE_NOT_FOUND', message: 'Profile not found' });
      }


      return res.status(200).json(profileData);
    } catch (error) {
      console.error('Error retrieving profile:', error);
      return res.status(500).json({ code: 'INTERNAL_SERVER_ERROR', message: 'An error occurred while retrieving the profile' });
    }
  }

  static async generateProfile(req: Request, res: Response): Promise<Response> {
    //TODO: remove
    const access_token = req.cookies['accessToken'];
    if (!access_token) {
      console.log('Access token not found');
      return res.status(401).json({ code: 'GENERAL_ERROR' });
    }

    try {
      const user: any = await jwt.verify(access_token, process.env.JWT_SECRET as string);
      const account_id = user.accountId; // Assuming req.user is populated via authentication middleware
      const {
        firstName: first_name,
        lastName: last_name,
        location,
        gender,
        iLike: like_gender,
        height,
        user_language,
        interests,
        bio,
      } = req.body;

      // Validate input
      if (!first_name || !last_name || !location || !gender || !like_gender || !height || !bio) {
        return res.status(400).json({ error: 'All fields are required' });
      }

      // Check if account exists
      const account = await getAccountById(account_id);
      if (!account) {
        return res.status(404).json({ code: 'INVALID_USER_CREDENTIALS' });
      }

      // Check if a profile already exists for this account
      const existingProfile = await getProfileByAccountId(account_id);
      if (existingProfile) {
        return res.status(400).json({ code: 'EMAIL_ALREADY_EXISTS' });
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
      await updateAccountStatus(account_id, 'online');

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
  }

  static async uploadPicture(req: Request, res: Response) {
    //TODO: remove
    const access_token = req.cookies['accessToken'];
    if (!access_token) {
      console.log('Access token not found');
      return res.status(401).json({ code: 'GENERAL_ERROR' });
    }

    try {
      const user: any = await jwt.verify(access_token, process.env.JWT_SECRET as string);
      const account_id = user.accountId; // Assuming req.user is populated via authentication middleware

      if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({ error: 'No files were uploaded.' });
      }
      // Access the file

      const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];
      const uploadDir = path.join(__dirname, `../../images/${account_id}/`);
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir);
      }
      const fileKeys = Object.keys(req.files);

      for (const key of fileKeys) {
        const file = req.files[key] as UploadedFile;

        if (!allowedMimeTypes.includes(file.mimetype)) {
          return res.status(400).json({ error: `Invalid image type for file ${file.name}.` });
        }

        const fileName = randomizeFileNameBase64(file.name)

        // Set the upload path
        const uploadPath = path.join(uploadDir, fileName);

        await file.mv(uploadPath);
        await addProfileImage(account_id, fileName)

      }
      return res.status(200).json({ code: 'wip' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ code: 'Failed to upload picture.' });
    }
  }
}
