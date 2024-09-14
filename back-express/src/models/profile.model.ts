
import { pool } from '../utils/db';
import { RowDataPacket } from 'mysql2';

export interface Profile {
  account_id: number;
  first_name: string;
  last_name: string;
  image_paths?: string;
  location: string;
  gender: string;
  like_gender: string;
  height: number;
  user_language: string;
  interests: string;
  bio: string;
  fame_score?: number;
}

export async function getProfileByAccountId(account_id: string): Promise<any> {
  const [profileRows] = await pool.query<RowDataPacket[]>(
    'SELECT * FROM profile WHERE account_id = ? LIMIT 1',
    [account_id]
  );
  return profileRows[0]; // Returns the profile or undefined
}


export async function createProfile(profileData: Profile): Promise<any> {
  const {
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
  } = profileData;

  const [insertResult] = await pool.query(
    'INSERT INTO profile (account_id, first_name, last_name, location, gender, like_gender, height, user_language, interests, bio) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [
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
    ]
  );

  return insertResult;
}
