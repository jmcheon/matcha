import { pool } from '../utils/db';
import { RowDataPacket, ResultSetHeader } from 'mysql2';


export interface Account {
  account_id: number;
  username?: string;
  email?: string;
  password?: string;
  google_id?: string;
  intra42_id?: string;
  github_id?: string;
  status: 'incomplete_social' | 'incomplete_profile' | 'pending_verification' | 'online' | 'offline';
  created_at: Date;
  last_modified_at?: Date;
  deleted_at?: Date;
  access_token?: string;
  refresh_token?: string;
  google_access_token?: string;
  google_refresh_token?: string;
  github_access_token?: string;
  github_refresh_token?: string;
  intra42_access_token?: string;
  intra42_refresh_token?: string;
}

function mapRowToAccount(row: RowDataPacket): Account {
  const account: Account = {
    account_id: row.account_id as number,
    email: row.email as string,
    password: row.password as string,
    status: row.status as 'incomplete_social' | 'incomplete_profile' | 'pending_verification' | 'online' | 'offline',
    refresh_token: row.refresh_token as string,
    google_id: row.google_id as string,
    intra42_id: row.intra42_id as string,
    github_id: row.github_id as string,
    created_at: row.created_at as Date,
    google_access_token: row.google_access_token as string,
    google_refresh_token: row.google_refresh_token as string,
    github_access_token: row.github_access_token as string,
    github_refresh_token: row.github_refresh_token as string,
    intra42_access_token: row.intra42_access_token as string,
    intra42_refresh_token: row.intra42_refresh_token as string
    // Map any other properties as needed
  };
  return account;
}

export async function checkIfUsernameExists(username: string): Promise<boolean> {
  const [rows] = await pool.query<RowDataPacket[]>(
    'SELECT username FROM account WHERE username = ?',
    [username]
  );
  return rows.length > 0;
}

export async function checkIfEmailExists(email: string): Promise<boolean> {
  const [rows] = await pool.query<RowDataPacket[]>(
    'SELECT email FROM account WHERE email = ?',
    [email]
  );
  return rows.length > 0;
}

// Function to create a new account
export async function createAccount(
  username: string,
  email: string,
  password: string,
  status: string
): Promise<number> {
  const [result] = await pool.query<ResultSetHeader>(
    'INSERT INTO account (username, email, password, status) VALUES (?, ?, ?, ?)',
    [username, email, password, status]
  );
  return result.insertId;
}

export async function getAccountByEmail(email: string): Promise<Account | undefined> {
  const [rows] = await pool.query<RowDataPacket[]>(
    'SELECT * FROM account WHERE email = ? LIMIT 1',
    [email]
  );
  if (rows.length > 0) {
    return mapRowToAccount(rows[0]);
  } else {
    return undefined;
  }
}

export async function getAccountById(account_id: number): Promise<Account | undefined> {
  const [rows] = await pool.query<RowDataPacket[]>(
    'SELECT * FROM account WHERE account_id = ? LIMIT 1',
    [account_id]
  );
  if (rows.length > 0) {
    return mapRowToAccount(rows[0]);
  } else {
    return undefined;
  }
}

export async function getAccountBySocialLogin(provider: string, social_id: string): Promise<Account | undefined> {
  let query = '';

  // Dynamically choose the query based on the provider
  if (provider === '42') {
    query = 'SELECT * FROM account WHERE intra42_id = ? LIMIT 1';
  } else if (provider === 'google') {
    query = 'SELECT * FROM account WHERE google_id = ? LIMIT 1';
  } else if (provider === 'github') {
    query = 'SELECT * FROM account WHERE github_id = ? LIMIT 1';
  } else {
    throw new Error(`Unsupported provider: ${provider}`);
  }

  const [rows] = await pool.query<RowDataPacket[]>(query, [social_id]);
  if (rows.length > 0) {
    return mapRowToAccount(rows[0]);
  } else {
    return undefined;
  }
}


export async function getAccountStatus(account_id: number): Promise<string | null> {
  const [rows] = await pool.query<RowDataPacket[]>(
    'SELECT * FROM account WHERE account_id = ? LIMIT 1',
    [account_id]
  );

  // Check if the account exists and return the status, otherwise return null
  if (rows.length > 0) {
    return rows[0].status;  // Assuming the "status" field exists in the account table
  } else {
    return null;  // Return null if no account with the given email is found
  }
}

export async function updateAccountPasswordAndStatus(
  account_id: number,
  password: string | null,
  status: string
): Promise<void> {
  await pool.query<ResultSetHeader>(
    'UPDATE account SET password = ?, status = ? WHERE account_id = ?',
    [password, status, account_id]
  );
}

export const updateAccountStatus = async (accountId: number, status: string): Promise<void> => {
  const connection = await pool.getConnection();
  try {
    const query = 'UPDATE account SET status = ? WHERE account_id = ?';
    const [result]: any = await connection.query(query, [status, accountId]);

    if (result.affectedRows === 0) {
      throw new Error(`Account with ID ${accountId} not found`);
    }

    console.log(`Account ${accountId} updated successfully to status ${status}`);
  } finally {
    connection.release();
  }
};

export async function updateAccount(
  account_id: number,
  email: string | null,
  password: string | null,
  google_id: string | null,
  intra42_id: string | null
): Promise<void> {
  // Create an array to hold the fields to update
  const fields: string[] = [];
  const values: (string | number | null)[] = [];

  // Check each field and add to the query if it's not null
  if (email !== null) {
    fields.push('email = ?');
    values.push(email);
  }
  if (password !== null) {
    fields.push('password = ?');
    values.push(password);
  }
  if (google_id !== null) {
    fields.push('google_id = ?');
    values.push(google_id);
  }
  if (intra42_id !== null) {
    fields.push('intra42_id = ?');
    values.push(intra42_id);
  }

  // Always add the account_id to the values array for the WHERE clause
  values.push(account_id);

  // If no fields are being updated, exit early
  if (fields.length === 0) {
    throw new Error('No fields to update');
  }

  // Construct the SQL query dynamically based on the fields provided
  const query = `UPDATE account SET ${fields.join(', ')} WHERE account_id = ?`;

  // Execute the query
  await pool.query<ResultSetHeader>(query, values);
}

