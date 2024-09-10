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
      const data: UserData = await $fetch(`http://back-nestjs:3005/refresh`, {
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
    info: { email: string; password: string },
  ) => {
    const { data } = await api.post('/login', {
      email: info.email,
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
  ) => {
    const { data } = await api.post(`/register?lang=${lang}`, { ...info });
    userData.value = data;
    startRefreshAuth();
  };

  const onGoogleLogin = () =>
    (window.location.href = `${BACK_HOST}/auth/google/login`);
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
