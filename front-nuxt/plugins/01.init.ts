export default defineNuxtPlugin(async (nuxtApp) => {
  const { ssrContext } = nuxtApp;
  const auth = useAuth();
  const { accountData, isLoggedIn } = storeToRefs(useUserStore());

  // Server-side specific logic
  if (ssrContext) {
    accountData.value.accessToken = useCookie('accessToken').value as string;
    if (accountData.value.accessToken && !accountData.value.email) {
      await auth.doRefreshTokenServer();
    }
  }

  // Client-side specific logic
  if (!ssrContext) {
    accountData.value.accessToken = useCookie('accessToken').value as string;

    if (accountData.value.accessToken) {
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
