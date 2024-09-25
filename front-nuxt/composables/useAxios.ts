import axios from 'axios';

export const useAxios = () => {
  const baseURL = useRuntimeConfig().public.BACK_HOST;
  const { accountData } = storeToRefs(useUserStore());
  const api = axios.create({
    baseURL,
    headers: {
      Authorization: accountData.value.accessToken
        ? `Bearer ${accountData.value.accessToken}`
        : undefined,
    },
    withCredentials: true,
  });
  return api;
};
