export default defineNuxtPlugin(async (nuxtApp) => {
  const { ssrContext } = nuxtApp;
  const auth = useAuth();
  const { userData, isLoggedIn } = storeToRefs(useUserStore());

  // Server-side specific logic
  if (ssrContext) {
    userData.value.accessToken = useCookie('accessToken').value as string;
    if (userData.value.accessToken && !userData.value.email) {
      await auth.doRefreshTokenServer();
    }
  }

  // Client-side specific logic
  if (!ssrContext) {
    userData.value.accessToken = useCookie('accessToken').value as string;

    if (userData.value.accessToken) {
      auth.startRefreshAuth();

      window.onfocus = () => {
        if (isLoggedIn.value) {
          auth.doRefreshTokenClient();
          auth.startRefreshAuth();
        }
      };

      window.onblur = () => {
        if (isLoggedIn.value) {
          auth.stopRefreshAuth();
        }
      };
    }
  }
});
