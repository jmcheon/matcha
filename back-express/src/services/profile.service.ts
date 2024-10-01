import axios from 'axios';
import { refreshGoogleAccessToken } from './auth.service';

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
