import type { AccountData, ProfileData } from '~/types';

export const useUserStore = defineStore('user', () => {
  const accountData = ref<AccountData>({} as AccountData);
  const profileData = ref<ProfileData | null>(null);
  const refreshTokenIntervalId = ref();

  const isLoggedIn = computed(() => !!accountData.value.accessToken);
  const isEmailVerified = computed(() => {
    if (accountData.value.status === 'pending_verification') return false;
    else return true;
  });
  const isProfileGenerated = computed(() => {
    if (profileData.value) {
      console.log('checker', profileData.value.image_paths);
      return true;
    } else return false;
  });
  const isProfileImageUploaded = computed(() => {
    if (profileData.value && profileData.value.image_paths) {
      return true;
    } else return false;
  });
  return {
    isLoggedIn,
    isEmailVerified,
    isProfileGenerated,
    isProfileImageUploaded,
    accountData,
    profileData,
    refreshTokenIntervalId,
  };
});
