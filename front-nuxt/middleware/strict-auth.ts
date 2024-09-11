export default defineNuxtRouteMiddleware(() => {
  const localePath = useLocalePath();
  const { isEmailVerified, isProfileGenerated, isLoggedIn } =
    storeToRefs(useUserStore());

  if (isLoggedIn.value && !isEmailVerified.value) {
    return navigateTo({ path: localePath('auth-verify-email') });
  }
  if (isLoggedIn.value && isEmailVerified.value && isProfileGenerated.value) {
    return navigateTo({ path: localePath('auth-generate-profile') });
  }
  if (!isLoggedIn.value) {
    return navigateTo({ path: localePath('auth-login') });
  }
});
