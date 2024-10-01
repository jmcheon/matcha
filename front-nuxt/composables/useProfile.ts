import type { AccountData, ProfileData } from '~/types';

const MAX_IMAGE_SIZE = 5242880; // 5MB

export const useProfile = () => {
  const axios = useAxios();

  const updateProfileImage = async (imagesToUpload: any) => {
    const formData = new FormData();
    imagesToUpload.forEach((image, index) => {
      formData.append(`images[${index}]`, image.file);
    });

    for (const [key, value] of formData.entries()) {
      console.log(`${key}: ${value}`);
    }

    const response = await axios.post('/api/profile/upload_image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      withCredentials: true, // Add this line to send cookies
    });
    return response;
  };

  const updateProfile = async (userId: string, userInfo: AccountData) => {
    await axios.patch('/api/account/' + userId, userInfo);
  };

  const generateProfile = async (userInfo: ProfileData) => {
    const result = await axios.post('/api/profile', userInfo);
    return result.data;
  };

  const getSocialProfileImage = async (userInfo: ProfileData) => {
    const result = await axios.get('/api/profile/social-image', userInfo);
    console.log(result);
    return result.data;
  };
  return {
    generateProfile,
    getSocialProfileImage,
    updateProfileImage,
    updateProfile,
  };
};
