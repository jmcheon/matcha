export default defineNuxtRouteMiddleware((to, from) => {
  const localePath = useLocalePath();
  const {
    isEmailVerified,
    isProfileGenerated,
    isProfileImageUploaded,
    isLoggedIn,
  } = storeToRefs(useUserStore());

  if (
    isLoggedIn.value &&
    isEmailVerified.value &&
    isProfileGenerated.value &&
    isProfileImageUploaded.value &&
    to.path !== localePath('index')
  ) {
    return navigateTo({ path: localePath('index') });
  }

  // If the user is not logged in, redirect to the login page
  if (!isLoggedIn.value && to.path !== localePath('auth-login')) {
    return navigateTo({ path: localePath('auth-login') });
  }

  // If logged in but email is not verified, redirect to the verify email page
  if (
    isLoggedIn.value &&
    !isEmailVerified.value &&
    to.path !== localePath('auth-verify-email')
  ) {
    return navigateTo({ path: localePath('auth-verify-email') });
  }

  // If email is verified but profile is not generated, redirect to generate profile page
  if (
    isLoggedIn.value &&
    isEmailVerified.value &&
    !isProfileGenerated.value &&
    to.path !== localePath('auth-generate-profile')
  ) {
    return navigateTo({ path: localePath('auth-generate-profile') });
  }

  // If the user is logged in, email verified, and profile generated, allow access to the index page
});
