import type { UserData } from '~/types';

export const useUserStore = defineStore('user', () => {
  const userData = ref<UserData>({} as UserData);
  const isLoggedIn = computed(() => !!userData.value.accessToken);

  return {
    isLoggedIn,
  };
});
