import type { AccountData } from '~/types';

export const useUserStore = defineStore('user', () => {
  const userData = ref<AccountData>({} as AccountData);
  const refreshTokenIntervalId = ref();

  const isLoggedIn = computed(() => !!userData.value.accessToken);
  const isEmailVerified = computed(() => userData.value.status);

  return {
    isLoggedIn,
    isEmailVerified,
    userData,
    refreshTokenIntervalId,
  };
});
