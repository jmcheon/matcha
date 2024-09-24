export interface AccountData {
  accountId?: number;
  email?: String;
  status?: String;
  accessToken?: String;
}
export interface ProfileData {
  account_id?: number;
  profile_id?: number;
  first_name?: string;
  last_name?: string;
  image_paths?: string[];
  location?: string;
  gender?: string;
  like_gender?: string;
  height?: number;
  user_language?: string;
  interests?: string;
  bio?: string;
  fame_score?: number;
}
