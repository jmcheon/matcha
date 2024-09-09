export default defineNuxtRouteMiddleware(() => {
  const localePath = useLocalePath();
  const { isEmailVerified, isLoggedIn } = storeToRefs(useUserStore());

  if (isLoggedIn.value && !isEmailVerified.value) {
    return navigateTo({ path: localePath('auth-verify-email') });
  }
  if (!isLoggedIn.value) {
    return navigateTo({ path: localePath('auth-login') });
  }
});
