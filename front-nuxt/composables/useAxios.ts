import axios from 'axios';

export const useAxios = () => {
  const baseURL = useRuntimeConfig().public.BACK_HOST;
  const { accountData } = storeToRefs(useUserStore());
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
