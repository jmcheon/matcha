export default defineNuxtPlugin(async (nuxtApp) => {
  const { ssrContext } = nuxtApp;
  const auth = useAuth();
  const axios = useAxios();
  const { accountData, isLoggedIn, profileData } = storeToRefs(useUserStore());

  // Server-side specific logic
  if (ssrContext) {
    accountData.value.access_token = useCookie('access_token').value as string;
    if (accountData.value.access_token && !accountData.value.email) {
      await auth.doRefreshTokenServer();
    }

    if (accountData.value.access_token && !profileData.value) {
      try {
        // Use $fetch to make an API call on the server-side
        profileData.value = await $fetch('/api/profile/', {
          headers: { Authorization: `Bearer ${accountData.value.access_token}` },
        });
      } catch (error) {
        console.error('Error fetching profile data on server:', error);
        profileData.value = null;
      }
    }
  }

  // Client-side specific logic
  if (!ssrContext) {
    accountData.value.access_token = useCookie('access_token').value as string;

    if (accountData.value.access_token) {
      auth.doRefreshTokenClient();
      auth.startRefreshAuth();

      if (!profileData.value) {
        try {
          // Use your API instance to fetch profile data
          const response = await axios.get('/api/profile/', {
            headers: {
              Authorization: `Bearer ${accountData.value.access_token}`,
            },
          });
          profileData.value = response.data;
        } catch (error) {
          console.error('Error fetching profile data on client:', error);
          profileData.value = null;
        }
      }

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
