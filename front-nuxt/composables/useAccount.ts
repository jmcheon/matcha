import type { AccountData } from '~/types';

export const useAccount = () => {
  const axios = useAxios();
  // const { accountData } = storeToRefs(useUserStore());

  const updateAccountPassword = async (userInfo: AccountData) => {
    console.log('updateAccountPassword():', userInfo);
    await axios.post('/update-password/', userInfo);
  };

  return {
    updateAccountPassword,
  };
};
