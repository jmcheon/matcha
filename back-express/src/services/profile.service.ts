import axios from 'axios';
import { refreshGithubAccessToken, refreshGoogleAccessToken, refreshIntra42AccessToken } from './auth.service';
import { pool } from '../utils/db';
import geoip from 'geoip-lite';
export async function getGoogleUserProfile(accountId: number, accessToken: string): Promise<any> {
  const apiUrl = 'https://www.googleapis.com/oauth2/v1/userinfo?alt=json';
  console.log("i am working")
  try {
    // Make API call with the access token
    const response = await axios.get(apiUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    console.log("response", response)
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.status === 401) {
      // Access token expired, refresh it
      const newAccessToken = await refreshGoogleAccessToken(accountId);

      // Retry the API call with the new access token
      const response = await axios.get(apiUrl, {
        headers: {
          Authorization: `Bearer ${newAccessToken}`,
        },
      });

      return response.data;
    } else {
      console.error('Error accessing Google API:', error?.response?.data || error.message);
      throw error;
    }
  }
}

export async function getGithubUserProfile(accountId: number, accessToken: string): Promise<any> {
  const apiUrl = 'https://api.github.com/user'; // GitHub API endpoint for authenticated user
  console.log("Fetching GitHub user profile");

  try {
    // Make API call with the access token
    const response = await axios.get(apiUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    console.log("GitHub API response", response);
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.status === 401) {
      // Access token expired, refresh it
      const newAccessToken = await refreshGithubAccessToken(accountId); // You should implement this function to refresh the GitHub token

      // Retry the API call with the new access token
      const response = await axios.get(apiUrl, {
        headers: {
          Authorization: `Bearer ${newAccessToken}`,
        },
      });

      return response.data;
    } else {
      console.error('Error accessing GitHub API:', error?.response?.data || error.message);
      throw error;
    }
  }
}

export async function getIntra42UserProfile(accountId: number, accessToken: string): Promise<any> {
  const apiUrl = 'https://api.intra.42.fr/v2/me'; // GitHub API endpoint for authenticated user
  console.log("Fetching intra42 user profile");
  try {
    // Make API call with the access token
    const response = await axios.get(apiUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.status === 401) {
      // Access token expired, refresh it
      const newAccessToken = await refreshIntra42AccessToken(accountId); // You should implement this function to refresh the GitHub token

      // Retry the API call with the new access token
      const response = await axios.get(apiUrl, {
        headers: {
          Authorization: `Bearer ${newAccessToken}`,
        },
      });

      return response.data;
    } else {
      console.error('Error accessing GitHub API:', error?.response?.data || error.message);
      throw error;
    }
  }
}
