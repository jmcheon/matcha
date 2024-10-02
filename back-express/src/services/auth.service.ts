const jwt = require('jsonwebtoken');
import { Response, CookieOptions } from "express";
import { pool } from "../utils/db"
import { RowDataPacket } from "mysql2";
import axios from "axios";

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

export async function refreshGoogleAccessToken(accountId: number): Promise<string> {
  // Retrieve the refresh token from the database
  const [rows] = await pool.query<RowDataPacket[]>(
    'SELECT google_refresh_token FROM account WHERE account_id = ?',
    [accountId]
  );
  const refreshToken = rows[0]?.google_refresh_token;

  if (!refreshToken) {
    throw new Error('Refresh token not available');
  }

  // Request a new access token using the refresh token
  const params = new URLSearchParams();
  params.append('client_id', process.env.GOOGLE_CLIENT_ID as string);
  params.append('client_secret', process.env.GOOGLE_CLIENT_SECRET as string);
  params.append('refresh_token', refreshToken);
  params.append('grant_type', 'refresh_token');

  try {
    const response = await axios.post('https://oauth2.googleapis.com/token', params.toString(), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });

    const newAccessToken = response.data.access_token;
    const newRefreshToken = response.data.refresh_token || refreshToken; // Use existing if none provided

    // Update both access and refresh tokens in the database
    await pool.query(
      'UPDATE account SET google_access_token = ?, google_refresh_token = ? WHERE account_id = ?',
      [newAccessToken, newRefreshToken, accountId]
    );

    return newAccessToken;
  } catch (error: any) {
    console.error('Error refreshing Google access token:', error?.response?.data || error.message);
    throw new Error('Failed to refresh access token');
  }
}

export async function refreshGithubAccessToken(accountId: number): Promise<string> {
  // Retrieve the refresh token from the database
  const [rows] = await pool.query<RowDataPacket[]>(
    'SELECT github_refresh_token FROM account WHERE account_id = ?',
    [accountId]
  );
  const refreshToken = rows[0]?.github_refresh_token;

  if (!refreshToken) {
    throw new Error('Refresh token not available');
  }

  // Request a new access token using the refresh token
  const params = new URLSearchParams();
  params.append('client_id', process.env.GITHUB_CLIENT_ID as string);
  params.append('client_secret', process.env.GITHUB_CLIENT_SECRET as string);
  params.append('refresh_token', refreshToken);
  params.append('grant_type', 'refresh_token');

  try {
    const response = await axios.post('https://github.com/login/oauth/access_token', params.toString(), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Accept': 'application/json' },
    });

    const newAccessToken = response.data.access_token;

    // Update the access token in the database
    await pool.query(
      'UPDATE account SET github_access_token = ? WHERE account_id = ?',
      [newAccessToken, accountId]
    );

    return newAccessToken;
  } catch (error: any) {
    console.error('Error refreshing GitHub access token:', error?.response?.data || error.message);
    throw new Error('Failed to refresh access token');
  }
}

export async function refreshIntra42AccessToken(accountId: number): Promise<string> {
  // Retrieve the refresh token from the database
  const [rows] = await pool.query<RowDataPacket[]>(
    'SELECT intra42_refresh_token FROM account WHERE account_id = ?',
    [accountId]
  );
  const refreshToken = rows[0]?.intra42_refresh_token;

  if (!refreshToken) {
    throw new Error('Refresh token not available');
  }

  // Request a new access token using the refresh token
  const params = new URLSearchParams();
  params.append('grant_type', 'refresh_token');
  params.append('client_id', process.env.INTRA42_CLIENT_ID as string);
  params.append('client_secret', process.env.INTRA42_CLIENT_SECRET as string);
  params.append('refresh_token', refreshToken);

  try {
    const response = await axios.post('https://api.intra.42.fr/oauth/token', params.toString(), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });

    const newAccessToken = response.data.access_token;
    const newRefreshToken = response.data.refresh_token || refreshToken; // Use existing if none provided

    // Update the access token and refresh token in the database
    await pool.query(
      'UPDATE account SET intra42_access_token = ?, intra42_refresh_token = ? WHERE account_id = ?',
      [newAccessToken, newRefreshToken, accountId]
    );

    return newAccessToken;
  } catch (error: any) {
    console.error('Error refreshing 42 Intra access token:', error?.response?.data || error.message);
    throw new Error('Failed to refresh access token');
  }
}

