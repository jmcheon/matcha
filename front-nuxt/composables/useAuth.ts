import type { AxiosInstance } from 'axios';

import type { AccountData } from '~/types';

export const useAuth = () => {
  const BACK_HOST = useRuntimeConfig().public.BACK_HOST;
  const { userData } = storeToRefs(useUserStore());
  const refreshTokenIntervalId = ref();
  const tokenDurationMins = Number(
    useRuntimeConfig().public.JWT_ACCESS_DURATION,
  );

  const doRefreshTokenServer = async () => {
    if (userData.value.username) return;

    const cookie = useRequestHeaders(['cookie']);
    try {
      const data: AccountData = await $fetch(`http://localhost:3005/refresh`, {
        method: 'POST',
        headers: {
          ...cookie,
          Authorization: `Bearer ${userData.value.accessToken}`,
        },
      });
      userData.value = data || {};
    } catch (error: any) {
      console.error(error.message);
    }
  };

  const doRefreshTokenClient = async () => {
    const axios = useAxios();
    try {
      const { data } = await axios.post(`/refresh`);
      userData.value = data || {};
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

  const doLogin = async (
    api: AxiosInstance,
    info: { username: string; password: string },
  ) => {
    const { data } = await api.post('/login', {
      username: info.username,
      password: info.password,
    });
    userData.value = data;
    startRefreshAuth();
  };

  const doLogout = async (api: AxiosInstance) => {
    await api.delete('/logout');
    userData.value = {} as AccountData;
    stopRefreshAuth();
  };

  const doCheckUserCredentials = async (
    api: AxiosInstance,
    info: { username: string; email: string },
    lang: string,
  ) => {
    await api.post(`/auth/forgot-password?lang=${lang}`, info);
  };

  const doRegister = async (
    api: AxiosInstance,
    info: AccountData,
    lang: string,
    isSocialLogin: boolean = false,
  ) => {
    try {
      let endpoint = '/register'; // Default to plain register

      // If it's a social login, use the social registration endpoint
      if (isSocialLogin) {
        endpoint = '/social-register';
      }

      // Make API request to the appropriate endpoint
      const { data } = await api.post(`${endpoint}?lang=${lang}`, { ...info });

      // Set user data and trigger the refresh auth process
      userData.value = data;
      startRefreshAuth();

      return data; // Return data if needed for further handling
    } catch (error) {
      console.error('Error during registration:', error);
      throw error; // Rethrow error for caller to handle
    }
  };

  const onGoogleLogin = () => (window.location.href = `${BACK_HOST}/google`);

  const onFtLogin = () => (window.location.href = `${BACK_HOST}/auth/ft/login`);
  const onGithubLogin = () => {
    window.location.href = `${BACK_HOST}/auth/github/login`;
  };

  return {
    doRefreshTokenServer,
    doRefreshTokenClient,
    startRefreshAuth,
    stopRefreshAuth,
    doLogin,
    doLogout,
    doRegister,
    doCheckUserCredentials,
    onGoogleLogin,
    onFtLogin,
    onGithubLogin,
  };
};
