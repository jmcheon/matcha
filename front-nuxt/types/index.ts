export interface AccountData {
  account_id?: number;
  email?: string;
  status?: string;
  access_token?: string;
  google_id?: string;
  intra42_id?: string;
  github_id?: string;
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
