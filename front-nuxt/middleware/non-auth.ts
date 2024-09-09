export default defineNuxtRouteMiddleware(() => {
  const localePath = useLocalePath();
  const { isLoggedIn, isEmailVerified } = storeToRefs(useUserStore());
  if (isLoggedIn.value && isEmailVerified.value) {
    return navigateTo({ path: localePath('index') });
  }
});
