export default defineNuxtRouteMiddleware((to, from) => {
  const localePath = useLocalePath();
  const {
    isLoggedIn,
    isEmailVerified,
    isProfileGenerated,
    isProfileImageUploaded,
  } = storeToRefs(useUserStore());

  const loginPath = localePath('auth-login');
  const verifyEmailPath = localePath('auth-verify-email');
  const generateProfilePath = localePath('auth-generate-profile');
  const uploadProfileImagePath = localePath('auth-upload-profile-image');
  const homePath = localePath('home');

  if (
    !isLoggedIn.value &&
    !isEmailVerified.value &&
    !isProfileGenerated.value &&
    !isProfileImageUploaded.value
  ) {
    if (to.path !== loginPath) {
      return navigateTo({ path: loginPath });
    }
  }

  // If logged in but email is not verified, redirect to the verify email page
  if (
    isLoggedIn.value &&
    !isEmailVerified.value &&
    !isProfileGenerated.value &&
    !isProfileImageUploaded.value
  ) {
    if (to.path !== verifyEmailPath) {
      return navigateTo({ path: verifyEmailPath });
    }
  }

  if (
    isLoggedIn.value &&
    isEmailVerified.value &&
    !isProfileGenerated.value &&
    !isProfileImageUploaded.value
  ) {
    if (to.path !== generateProfilePath) {
      return navigateTo({ path: generateProfilePath });
    }
  }

  if (
    isLoggedIn.value &&
    isEmailVerified.value &&
    isProfileGenerated.value &&
    !isProfileImageUploaded.value
  ) {
    if (to.path !== uploadProfileImagePath) {
      return navigateTo({ path: uploadProfileImagePath });
    }
  }

  if (
    isLoggedIn.value &&
    isEmailVerified.value &&
    isProfileGenerated.value &&
    isProfileImageUploaded.value
  ) {
    if (to.path !== homePath) {
      return navigateTo({ path: homePath });
    }
  }
});
