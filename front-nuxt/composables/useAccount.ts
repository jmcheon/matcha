import type { AccountData } from '~/types';

export const useAccount = () => {
  const axios = useAxios('/account');
  // const { accountData } = storeToRefs(useUserStore());

  const updateAccountPassword = async (userInfo: AccountData) => {
    console.log('updateAccountPassword():', userInfo);
    await axios.post('/update-password/', userInfo);
  };

  const updateAccount = async (userId: string, userInfo: AccountData) => {
    await axios.patch('/account/' + userId, userInfo);
  };

  return {
    updateAccountPassword,
    updateAccount,
  };
};
