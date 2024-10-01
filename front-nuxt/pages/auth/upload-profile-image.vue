<template>
  <v-container class="min-h-screen d-flex align-center justify-center">
    <v-card class="mx-auto" max-width="600">
      <!-- Title -->
      <v-card-title class="text-h5 font-weight-bold text-center">
        {{ $t('AuthUploadProfileImage.title') }}
      </v-card-title>

      <!-- Main Image Upload Display -->
      <v-card-text>
        <div class="mb-6">
          <div class="relative w-full h-96 flex items-center justify-center">
            <template v-if="uploadedImages[currentImageIndex]">
              <v-hover v-slot="{ isHovering, props }">
                <div
                  class="relative w-full h-full flex items-center justify-center"
                  v-bind="props"
                >
                  <img
                    :src="uploadedImages[currentImageIndex].url"
                    class="max-w-full max-h-full object-contain"
                    @click="$refs.imageInput.click()"
                  />
                  <div
                    v-if="isHovering"
                    class="absolute inset-0 flex items-center justify-center bg-gray-500/50"
                  >
                    <v-btn @click="removeImage(currentImageIndex)">
                      Remove image
                    </v-btn>
                  </div>
                </div>
              </v-hover>
            </template>
            <template v-else>
              <!-- Show upload button if no image is in the current slot -->
              <div
                class="flex items-center justify-center bg-slate-500 h-full w-full cursor-pointer"
              >
                <button v-if="socialLoginType" @click="getSocialProfileImage">
                  {{ socialLoginType }}
                </button>
                <button
                  class="bg-primary text-white py-2 px-4 rounded-lg flex items-center space-x-2"
                  @click="$refs.imageInput.click()"
                >
                  <span>{{ $t('AuthUploadProfileImage.upload') }}</span>
                </button>
              </div>
            </template>
          </div>

          <!-- Hidden File Input -->
          <input
            ref="imageInput"
            type="file"
            accept="image/*"
            class="d-none"
            @change="handleImageUpload"
          />
        </div>

        <!-- Thumbnails (5 slots) -->
        <div class="flex space-x-4 mb-8">
          <div
            v-for="(image, index) in uploadedImages"
            :key="index"
            class="flex items-center justify-center aspect-square ml-3"
            :class="{
              'border-2 border-red-500': currentImageIndex === index,
              'border-2 border-dotted border-gray-300':
                currentImageIndex !== index,
              'w-14 md:w-20 lg:w-24': true, // responsive width
            }"
            @click="handleThumbnailClick(index)"
          >
            <template v-if="image">
              <v-img :src="image.url" width="100%" height="100%" contain />
            </template>
            <template v-else>
              <v-icon>mdi-plus</v-icon>
            </template>
          </div>
        </div>

        <!-- Submit Button -->
        <v-btn
          color="green darken-1"
          block
          :loading="loading"
          @click="submitImages"
        >
          <span v-if="!loading">{{ $t('AuthUploadProfileImage.submit') }}</span>
          <span v-else>Loading...</span>
        </v-btn>

        <!-- Error Display -->
        <v-alert v-if="errorGlobal" type="error" class="mt-4">
          {{ errorGlobal }}
        </v-alert>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup>
  import { ref } from 'vue';
  import { useI18n } from 'vue-i18n';

  const currentImageIndex = ref(0);
  const loading = ref(false);
  const errorGlobal = ref('');
  const { t } = useI18n();
  const localePath = useLocalePath();
  const maxImages = 5;
  const uploadedImages = ref(Array(maxImages).fill(null));
  const { updateProfileImage, getSocialProfileImage } = useProfile();

  const { profileData, accountData, socialLoginType } =
    storeToRefs(useUserStore());

  const handleImageUpload = async (event) => {
    const file = event.target.files[0]; // Only handle one file at a time
    if (!file) return;

    const url = URL.createObjectURL(file);

    // Replace or assign the image to the current slot
    uploadedImages.value[currentImageIndex.value] = { file, url };

    // Clear the file input
    event.target.value = '';
  };

  const handleThumbnailClick = (index) => {
    console.log('Selected index:', index); // Debugging line
    currentImageIndex.value = index;
  };

  const removeImage = (index) => {
    if (uploadedImages.value[index]) {
      URL.revokeObjectURL(uploadedImages.value[index].url);
      uploadedImages.value[index] = null;
    }

    // Optionally reset currentImageIndex if needed
    if (currentImageIndex.value === index) {
      currentImageIndex.value = uploadedImages.value.findIndex(
        (img) => img !== null,
      );
      if (currentImageIndex.value === -1) currentImageIndex.value = 0; // Default to first slot
    }
  };

  const submitImages = async () => {
    // automatically remove empty indexes
    const imagesToUpload = uploadedImages.value.filter((img) => img !== null);

    if (imagesToUpload.length === 0) {
      errorGlobal.value = t('Error.NO_IMAGES_UPLOADED');
      return;
    }

    try {
      loading.value = true;
      errorGlobal.value = '';

      const response = await updateProfileImage(imagesToUpload);

      profileData.value.image_paths = response.data;
      await navigateTo({ path: localePath('home') });
    } catch (error) {
      console.error('Upload error:', error);
      errorGlobal.value = t('Error.GENERAL_ERROR');
    } finally {
      loading.value = false;
    }
  };
</script>
