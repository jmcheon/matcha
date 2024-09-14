import { pool } from '../utils/db';
import { RowDataPacket, ResultSetHeader } from 'mysql2';


export interface Account {
  account_id: number;
  email?: string;
  password?: string;
  google_id?: string;
  intra_username?: string;
  status: 'incomplete_profile' | 'pending_verification' | 'online' | 'offline';
  created_at: Date;
  last_modified_at?: Date;
  deleted_at?: Date;
  access_token?: string;
  refresh_token?: string;
}

function mapRowToAccount(row: RowDataPacket): Account {
  const account: Account = {
    account_id: row.account_id as number,
    email: row.email as string,
    password: row.password as string,
    status: row.status as 'incomplete_profile' | 'pending_verification' | 'online' | 'offline',
    refresh_token: row.refresh_token as string,
    google_id: row.google_id as string,
    created_at: row.created_at as Date,
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

