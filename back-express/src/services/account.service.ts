import { pool } from '../utils/db';
import { Account } from '../models/account.model';

// export const createAccount = async (accountData: Omit<Account, 'account_id' | 'created_at'>): Promise<Account> => {
//   const connection = await pool.getConnection();
//   try {
//     const query = 'INSERT INTO account (email, password, google_username, intra_username, status) VALUES (?, ?, ?, ?, ?)';
//     const [result] = await connection.execute(query, [
//       accountData.email,
//       accountData.password,
//       accountData.google_username,
//       accountData.intra_username,
//       accountData.status || 'pending_verification',
//     ]);
//     return {
//       account_id: (result as any).insertId,
//       ...accountData,
//       created_at: new Date(),
//     } as Account;
//   } finally {
//     connection.release();
//   }
// };

// export const getAccountById = async (accountId: number): Promise<Account | null> => {
//   const connection = await pool.getConnection();
//   try {
//     const query = 'SELECT * FROM account WHERE account_id = ?';
//     const [rows]: any = await connection.query(query, [accountId]);
//     console.log(rows)
//     if ((rows as Account[]).length) {
//       return rows[0] as Account;
//     }
//     return null;
//   } finally {
//     connection.release();
//   }
// };

// export const getAccountBySocial = async (social: string, username: string): Promise<Account | null> => {
//   const connection = await pool.getConnection();
//   try {
//     let query;
//     if (social === "google")
//       query = 'SELECT * FROM account WHERE google_username = ?';
//     else
//       query = 'SELECT * from account where intra_username = ?'
//     const [rows]: any = await connection.query(query, [username]);
//     console.log(rows)
//     if ((rows as Account[]).length) {
//       return rows[0] as Account;
//     }
//     return null;
//   } finally {
//     connection.release();
//   }
// };


// // export const update = async (account_id: number, status: string): Promise<Account | null> => {
// //   const connection = await pool.getConnection();
// //   try {
// //     let query;
// //     const [rows]: any = await connection.query(query, [username]);
// //     console.log(rows)
// //     if ((rows as Account[]).length) {
// //       return rows[0] as Account;
// //     }
// //     return null;
// //   } finally {
// //     connection.release();
// //   }
// // };

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

