export interface Account {
  account_id: number;
  email?: string;
  password?: string;
  google_username?: string;
  intra_username?: string;
  status: 'incomplete_profile' | 'pending_verification' | 'online' | 'offline';
  created_at: Date;
  last_modified_at?: Date;
  deleted_at?: Date;
  access_token?: string;
  refresh_token?: string;
}
