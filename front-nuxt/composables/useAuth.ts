import type { AxiosInstance } from 'axios';

import type { AccountData, ProfileData } from '~/types';

export const useAuth = () => {
  const axios = useAxios();
  const BACK_HOST = useRuntimeConfig().public.BACK_HOST;
  const { accountData, profileData } = storeToRefs(useUserStore());
  const refreshTokenIntervalId = ref();
  const tokenDurationMins = Number(
    useRuntimeConfig().public.JWT_ACCESS_DURATION,
  );

  const doRegister = async (
    info: AccountData,
    lang: string,
    socialLogin: Record<string, any> = {},
  ) => {
    try {
      let endpoint = '/register'; // Default to plain register

      const payload = { ...info } as Record<string, any>;
      // If it's a social login, use the social registration endpoint
      if (Object.keys(socialLogin).length > 0) {
        endpoint = '/social-register';
        payload.socialInfo = socialLogin; // Dynamically add socialInfo field
      }

      const { data } = await axios.post(`${endpoint}?lang=${lang}`, payload);
      // Set user data and trigger the refresh auth process
      accountData.value = data;
      console.log('doRegister acconutData:', accountData.value);
      startRefreshAuth();

      return data; // Return data if needed for further handling
    } catch (error) {
      console.error('Error during registration:', error);
      throw error; // Rethrow error for caller to handle
    }
  };

  const doRequestEmail = async (lang: string) => {
    try {
      const { data } = await axios.post(
        `/request-email?lang=${lang}`,
        accountData.value,
      );
      accountData.value = data;
      console.log('doRequestEmail acconutData:', accountData.value);
      startRefreshAuth();
    } catch (error) {
      console.error('Error during request email:', error);
      throw error;
    }
  };

  const doRefreshTokenServer = async () => {
    if (accountData.value.accountId) return;

    const cookie = useRequestHeaders(['cookie']);
    try {
      const data: AccountData = await $fetch(`http://localhost:3005/refresh`, {
        method: 'POST',
        headers: {
          ...cookie,
          Authorization: `Bearer ${accountData.value.accessToken}`,
        },
      });
      accountData.value = data || {};
    } catch (error: any) {
      console.error(error.message);
    }
  };

  const doRefreshTokenClient = async () => {
    try {
      const { data } = await axios.post(`/refresh`);
      accountData.value = data || {};
    } catch (error: any) {
      console.error(error.message);
    }
  };

  const startRefreshAuth = () => {
    refreshTokenIntervalId.value = setInterval(
      () => doRefreshTokenClient(),
      (tokenDurationMins - 1) * 60 * 1000,
    );
  };

  const stopRefreshAuth = () => {
    clearInterval(refreshTokenIntervalId.value);
  };

  const doLogin = async (info: { username: string; password: string }) => {
    const { data } = await axios.post('/login', {
      username: info.username,
      password: info.password,
    });
    try {
      const profileResponse = await axios.get('/api/profile/', {
        headers: { Authorization: `Bearer ${data.accessToken}` },
      });

      console.log(profileResponse);
      // Store profile data in the state
      profileData.value = profileResponse.data;
    } catch (error) {
      // Handle the error by setting profileData to null
      profileData.value = null;

      // // Optionally, you can handle specific error statuses
      // if (axios.isAxiosError(error) && error.response) {
      //   const statusCode = error.response.status;
      //   if (statusCode === 400) {
      //     // Handle 400 Bad Request error specifically if needed
      //   }
      //   // Handle other status codes as necessary
    }
    accountData.value = data;
    startRefreshAuth();
  };

  const doLogout = async (api: AxiosInstance) => {
    await api.delete('/logout');
    accountData.value = {} as AccountData;
    stopRefreshAuth();
  };

  const doCheckUserCredentials = async (
    api: AxiosInstance,
    info: { email: string },
    lang: string,
  ) => {
    await api.post(`/forgot-password?lang=${lang}`, info);
  };

  const onGoogleLogin = () => (window.location.href = `${BACK_HOST}/google`);

  const onFtLogin = () => (window.location.href = `${BACK_HOST}/ft`);
  const onGithubLogin = () => {
    window.location.href = `${BACK_HOST}/github`;
  };

  return {
    doRefreshTokenServer,
    doRefreshTokenClient,
    startRefreshAuth,
    stopRefreshAuth,
    doLogin,
    doLogout,
    doRegister,
    doRequestEmail,
    doCheckUserCredentials,
    onGoogleLogin,
    onFtLogin,
    onGithubLogin,
  };
};
