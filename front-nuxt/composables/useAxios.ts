import axios from 'axios';

export const useAxios = () => {
  const baseURL = useRuntimeConfig().public.BACK_HOST;
  const { userData } = storeToRefs(useUserStore());
  const api = axios.create({
    baseURL,
    headers: {
      Authorization: userData.value.accessToken
        ? `Bearer ${userData.value.accessToken}`
        : undefined,
    },
    withCredentials: true,
  });
  return api;
};
