import type { AccountData, ProfileData } from '~/types';

const MAX_IMAGE_SIZE = 5242880; // 5MB

export const useProfile = () => {
  const axios = useAxios();
  const { profileData } = storeToRefs(useUserStore());

  const updateProfileImage = async (imagesToUpload: any) => {
    const formData = new FormData();
    imagesToUpload.forEach((image, index) => {
      formData.append(`images[${index}]`, image.file);
    });

    for (const [key, value] of formData.entries()) {
      console.log(`${key}: ${value}`);
    }

    const response = await axios.post('/profile/upload_image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      withCredentials: true, // Add this line to send cookies
    });
    return response;
  };

  const updateProfile = async (userId: string, userInfo: AccountData) => {
    await axios.patch('/account/' + userId, userInfo);
  };

  const updateAccountPassword = async (userInfo: AccountData) => {
    await axios.post('/update-password/', userInfo);
  };

  const getProfile = async () => {
    try {
      const profileResponse = await axios.get('/profile');

      console.log(profileResponse);
      // Store profile data in the state
      profileData.value = profileResponse.data;
    } catch (error) {
      // Handle the error by setting profileData to null
      profileData.value = null;
    }
  };

  const generateProfile = async (profileInfo: ProfileData) => {
    console.log('profile', profileInfo);
    const result = await axios.post('/profile', profileInfo);
    return result.data;
  };

  const getSocialProfileImage = async (socialLoginType: string) => {
    console.log('socialLoginType', socialLoginType);
    const result = await axios.get('/profile/social-image', {
      params: {
        type: socialLoginType,
      },
      withCredentials: true, // Include cookies if necessary
    });
    return result.data; // This should now be a plain string (image URL)
  };
  return {
    generateProfile,
    getProfile,
    getSocialProfileImage,
    updateProfileImage,
    updateProfile,
    updateAccountPassword,
  };
};
