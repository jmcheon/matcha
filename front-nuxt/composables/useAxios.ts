import axios from 'axios';

export const useAxios = (prefix: String = '') => {
  const baseURL = `${useRuntimeConfig().public.NGINX_HOST}/api${prefix}`;
  const { accountData } = storeToRefs(useUserStore());
  console.log('useAxios():', accountData.value, accountData.value.access_token);
  const api = axios.create({
    baseURL,
    headers: {
      Authorization: accountData.value.access_token
        ? `Bearer ${accountData.value.access_token}`
        : undefined,
    },
    withCredentials: true,
  });
  return api;
};
