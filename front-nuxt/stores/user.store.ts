import type { AccountData, ProfileData } from '~/types';

export const useUserStore = defineStore('user', () => {
  const accountData = ref<AccountData>({} as AccountData);
  const profileData = ref<ProfileData | null>(null);
  const refreshTokenIntervalId = ref();

  const isLoggedIn = computed(() => !!accountData.value.access_token);
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
  const socialLoginType = computed(() => {
    const data = accountData.value;
    if (data?.github_id) {
      return 'github';
    } else if (data?.google_id) {
      return 'google';
    } else if (data?.intra42_id) {
      return 'intra42';
    } else {
      return null; // or undefined or false
    }
  });
  return {
    isLoggedIn,
    isEmailVerified,
    isProfileGenerated,
    isProfileImageUploaded,
    accountData,
    profileData,
    refreshTokenIntervalId,
    socialLoginType,
  };
});
