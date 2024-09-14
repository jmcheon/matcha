const jwt = require('jsonwebtoken');
import { Response, CookieOptions } from "express";
import { pool } from "../utils/db"
[]

const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key'; // You should set this securely
const ACCESS_TOKEN_EXPIRATION = 900; // Example: 15 minutes in seconds
const REFRESH_TOKEN_EXPIRATION = 7 * 24 * 60 * 60; // Example: 7 days in seconds

function getExpirationAccess() {
  return ACCESS_TOKEN_EXPIRATION; // 15 minutes or desired value
}

function getExpirationRefresh() {
  return REFRESH_TOKEN_EXPIRATION; // 7 days or desired value
}

export function getCookieWithJwtAccessToken(userId: number) {
  const payload = { "accountId": userId };
  const token = jwt.sign(payload, JWT_SECRET, {
    expiresIn: `${getExpirationAccess()}s`,
  });

  return {
    accessToken: token,
    options: {
      domain: 'localhost', // Change this in production
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Set secure only for HTTPS
      expires: new Date(Date.now() + 1000 * getExpirationAccess()), // Set expiration in ms
    },
  };
}

export function getCookieWithJwtRefreshToken(userId: number) {
  const payload = { "accountId": userId };
  const expiration = getExpirationRefresh();
  const token = jwt.sign(payload, JWT_SECRET, {
    expiresIn: expiration,
  });

  return {
    refreshToken: token,
    options: {
      domain: 'localhost', // Change this in production
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Set secure only for HTTPS
      expires: new Date(Date.now() + 1000 * expiration), // Set expiration in ms
    },
  };
}

export const saveRefreshToken = async (accountId: number, token: string): Promise<void> => {
  const connection = await pool.getConnection();
  try {
    console.log("DB connection established for account", accountId);
    const query = 'UPDATE account SET refresh_token = ? WHERE account_id = ?';

    // Log the query and values
    console.log("Running query:", query, "with values:", [token, accountId]);

    const [result]: any = await connection.query(query, [token, accountId]);

    if (result.affectedRows === 0) {
      throw new Error(`Account with ID ${accountId} not found`);
    }

    console.log(`Account ${accountId} refresh token successfully saved`);
  } catch (error) {
    console.error(`Error saving refresh token for account ${accountId}:`, error);
    throw error;
  } finally {
    connection.release();
    console.log("DB connection released for account", accountId);
  }
};
