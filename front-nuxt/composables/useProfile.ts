import type { AxiosInstance } from 'axios';

import type { ProfileData } from '~/types';

const MAX_IMAGE_SIZE = 5242880; // 5MB

const imageAlertActive = ref(false);

export const useProfile = () => {
  const axios = useAxios();
  const router = useRouter();

  function updateAvatar(event: any) {
    const target = event.target;
    const file = target.files[0];
    if (file) {
      if (file.size > MAX_IMAGE_SIZE) {
        imageAlertActive.value = true;
        target.value = '';
        return setTimeout(() => {
          imageAlertActive.value = false;
        }, 5000);
      }

      const reader = new FileReader();

      reader.onload = async () => {
        const formData = new FormData();
        formData.append('image', file);

        try {
          await axios.patch(`/users/avatar`, formData);
          router.go();
        } catch (error) {
          console.error(error);
        }
      };
      reader.readAsDataURL(file);
    }
  }

  const updateProfile = async (
    api: AxiosInstance,
    userId: string,
    userInfo: UserData,
  ) => {
    await api.patch('/users/' + userId, userInfo);
  };

  const generateProfile = async (api: AxiosInstance, userInfo: ProfileData) => {
    await api.post('/api/profile', userInfo);
  };

  return {
    imageAlertActive,
    generateProfile,
    updateAvatar,
    updateProfile,
  };
};
