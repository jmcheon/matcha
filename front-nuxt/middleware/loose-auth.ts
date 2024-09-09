export default defineNuxtRouteMiddleware(() => {
  // Check login, no need to verify email
  const { isLoggedIn } = storeToRefs(useUserStore());
  const localePath = useLocalePath();

  if (!isLoggedIn.value) {
    return navigateTo({ path: localePath("auth-login") });
  }
});
