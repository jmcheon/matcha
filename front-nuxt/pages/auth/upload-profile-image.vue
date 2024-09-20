<script setup>
  import { ref } from 'vue';

  // definePageMeta({
  //   layout: 'auth',
  //   middleware: ['strict-auth'],
  // });

  const uploadedImages = ref([]);
  const currentImageIndex = ref(-1); // -1 for "No image selected"
  const loading = ref(false);
  const errorGlobal = ref('');
  const axios = useAxios();
  const { t } = useI18n();

  const maxImages = 5;

  const handleImageUpload = async (event) => {
    const files = event.target.files;
    if (uploadedImages.value.length + files.length > maxImages) {
      errorGlobal.value = t('Error.MAX_IMAGES_EXCEEDED', { max: maxImages });
      return;
    }

    // Process image files and push them into the uploadedImages array
    Array.from(files).forEach((file) => {
      uploadedImages.value.push(URL.createObjectURL(file));
    });

    // If no image was selected previously, select the first image
    if (currentImageIndex.value === -1) {
      currentImageIndex.value = 0;
    }
  };

  const handleImageClick = (index) => {
    currentImageIndex.value = index;
  };

  const removeImage = (index) => {
    uploadedImages.value.splice(index, 1);
    if (currentImageIndex.value >= uploadedImages.value.length) {
      currentImageIndex.value = uploadedImages.value.length - 1;
    }
  };

  const submitImages = async () => {
    try {
      loading.value = true;
      errorGlobal.value = '';
      // Logic to upload images to server using axios
      // Example: await axios.post('/upload', formData);
      // Redirect or handle success
    } catch (e) {
      errorGlobal.value = t('Error.GENERAL_ERROR');
    } finally {
      loading.value = false;
    }
  };
</script>
<template>
  <v-container class="fill-height" fluid>
    <v-row justify="center">
      <v-col cols="12" sm="10" md="8" lg="6" class="ma-auto">
        <v-card class="pa-4" elevation="8">
          <v-card-title class="text-h5 text-center">
            {{ $t('UploadProfileImage.title') }}
          </v-card-title>

          <!-- Main Image/Slider Upload Display -->
          <div
            class="text-center mb-4"
            style="position: relative; cursor: pointer; max-height: 400px"
            @click="$refs.imageInput.click()"
          >
            <input
              ref="imageInput"
              type="file"
              accept="image/*"
              multiple
              style="display: none"
              @change="handleImageUpload"
            />
            <v-img
              v-if="uploadedImages.length && currentImageIndex !== -1"
              :src="uploadedImages[currentImageIndex]"
              max-height="400"
              max-width="100%"
              class="d-block mx-auto mb-2"
            />
            <div
              v-else
              class="text-subtitle-1"
              style="
                display: flex;
                justify-content: center;
                align-items: center;
                height: 400px;
                background-color: #f5f5f5;
                border: 1px dashed #ccc;
              "
            >
              No image selected. Click to upload.
            </div>
          </div>

          <!-- Thumbnails (vertical) -->
          <v-row class="mb-4" justify="center" align="center">
            <v-col
              v-for="(image, index) in uploadedImages"
              :key="index"
              cols="2"
              class="d-flex justify-center"
            >
              <v-avatar
                :src="image"
                size="64"
                class="ma-2"
                @click="handleImageClick(index)"
              />
              <v-icon small @click="removeImage(index)">mdi-close</v-icon>
            </v-col>
          </v-row>

          <!-- Submit Button -->
          <v-btn
            color="green"
            :loading="loading"
            block
            large
            class="mt-4"
            @click="submitImages"
          >
            {{ $t('UploadProfileImage.submit') }}
          </v-btn>

          <!-- Error Display -->
          <v-alert v-if="errorGlobal" type="error" class="mt-3">
            {{ errorGlobal }}
          </v-alert>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
