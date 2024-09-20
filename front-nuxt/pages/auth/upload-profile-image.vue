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
          <div
            v-if="uploadedImages.length && currentImageIndex !== -1"
            class="relative"
          >
            <v-img
              :src="uploadedImages[currentImageIndex].url"
              max-height="400"
              contain
              class="mb-4 rounded"
            />
            <!-- Remove Button -->
            <v-btn
              icon
              small
              class="red darken-2 white--text"
              absolute
              top
              right
              @click="removeImage(currentImageIndex)"
            >
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </div>

          <!-- Show upload button if no images are uploaded -->
          <v-sheet
            v-else
            class="d-flex align-center justify-center"
            height="400"
            color="grey lighten-4"
            tile
            outlined
          >
            <v-btn color="primary" large @click="$refs.imageInput.click()">
              <v-icon>mdi-plus</v-icon>
              {{ $t('AuthUploadProfileImage.upload') }}
            </v-btn>
          </v-sheet>

          <!-- Hidden File Input -->
          <input
            ref="imageInput"
            type="file"
            accept="image/*"
            multiple
            class="d-none"
            @change="handleImageUpload"
          />
        </div>

        <!-- Thumbnails (5 slots) -->
        <v-row justify="center">
          <v-col v-for="index in maxImages" :key="index" cols="2">
            <v-avatar
              v-if="uploadedImages[index - 1]"
              :src="uploadedImages[index - 1].url"
              :class="{
                'selected-avatar': currentImageIndex === index - 1,
                'default-avatar': currentImageIndex !== index - 1,
              }"
              size="56"
              @click="handleThumbnailClick(index - 1)"
            />
            <v-avatar
              v-else
              class="default-avatar"
              size="56"
              @click="handleThumbnailClick(index - 1)"
            >
              <v-icon>mdi-plus</v-icon>
            </v-avatar>
          </v-col>
        </v-row>

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
  import { ref, onBeforeUnmount } from 'vue';
  import { useI18n } from 'vue-i18n';
  import axios from 'axios';

  const uploadedImages = ref([]);
  const currentImageIndex = ref(-1);
  const loading = ref(false);
  const errorGlobal = ref('');
  const { t } = useI18n();
  const maxImages = 5;

  const handleImageUpload = async (event) => {
    const files = event.target.files;
    if (uploadedImages.value.length + files.length > maxImages) {
      errorGlobal.value = t('Error.MAX_IMAGES_EXCEEDED', { max: maxImages });
      return;
    }

    Array.from(files).forEach((file) => {
      const url = URL.createObjectURL(file);
      uploadedImages.value.push({ file, url });
    });

    if (currentImageIndex.value === -1 && uploadedImages.value.length > 0) {
      currentImageIndex.value = 0;
    }

    event.target.value = '';
  };

  const handleThumbnailClick = (index) => {
    console.log('Selected index:', index); // Debugging line
    if (uploadedImages.value[index]) {
      currentImageIndex.value = index;
    }
  };

  const removeImage = (index) => {
    URL.revokeObjectURL(uploadedImages.value[index].url);
    uploadedImages.value.splice(index, 1);

    if (uploadedImages.value.length === 0) {
      currentImageIndex.value = -1;
    } else if (currentImageIndex.value === index) {
      currentImageIndex.value = 0;
    } else if (currentImageIndex.value > index) {
      currentImageIndex.value -= 1;
    }
  };

  const submitImages = async () => {
    if (uploadedImages.value.length === 0) {
      errorGlobal.value = t('Error.NO_IMAGES_UPLOADED');
      return;
    }

    try {
      loading.value = true;
      errorGlobal.value = '';
      const formData = new FormData();

      uploadedImages.value.forEach((image, index) => {
        formData.append(`images[${index}]`, image.file);
      });

      const response = await axios.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Upload successful:', response.data);
    } catch (error) {
      console.error('Upload error:', error);
      errorGlobal.value = t('Error.GENERAL_ERROR');
    } finally {
      loading.value = false;
    }
  };

  onBeforeUnmount(() => {
    uploadedImages.value.forEach((image) => {
      URL.revokeObjectURL(image.url);
    });
  });
</script>

<style scoped>
  .default-avatar {
    border: 2px dotted #ccc;
    border-radius: 0;
    width: 56px;
    height: 56px;
  }

  .selected-avatar {
    border: 2px solid red;
    border-radius: 0;
    width: 56px;
    height: 56px;
  }
</style>
