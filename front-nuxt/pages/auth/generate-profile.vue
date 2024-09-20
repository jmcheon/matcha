<script setup>
  import { ref } from 'vue';

  // definePageMeta({
  //   layout: 'auth',
  //   middleware: ['strict-auth'],
  // });
  const dirty = ref(false);
  const loading = ref(false);
  const errorGlobal = ref('');
  const localePath = useLocalePath();
  const firstName = ref('');
  const lastName = ref('');
  const location = ref('');
  const gender = ref('');
  const age = ref(18);
  const height = ref(130);
  const iLike = ref('');
  const bio = ref('');
  const interests = ref('');
  const { t } = useI18n();
  const axios = useAxios();
  const { generateProfile } = useProfile();

  const { firstNameValidator, lastNameValidator } = useValidator();
  const { error: errorFirstName } = firstNameValidator(dirty, firstName, t);
  const { error: errorLastName } = lastNameValidator(dirty, lastName, t);

  const handleGenerateProfile = async () => {
    dirty.value = true;
    // Validate the form before submission
    if (
      errorFirstName.value ||
      errorLastName.value ||
      !location.value ||
      !gender.value ||
      !iLike.value ||
      !bio.value ||
      !interests.value
    )
      return;

    const profileData = {
      firstName: firstName.value,
      lastName: lastName.value,
      location: location.value,
      gender: gender.value,
      age: age.value,
      height: height.value,
      iLike: iLike.value,
      bio: bio.value,
      interests: interests.value.split(',').map((tag) => tag.trim()),
    };

    try {
      loading.value = true;
      errorGlobal.value = '';
      console.log('Profile Data:', profileData);
      await generateProfile(axios, profileData);
      // Redirect or handle success
      await navigateTo({ path: localePath('auth-upload-profile-image') });
    } catch (e) {
      if (e.response && e.response.data.code) {
        errorGlobal.value = t(`Error.${e.response.data.code}`);
      } else {
        errorGlobal.value = t('Error.GENERAL_ERROR');
      }
    } finally {
      loading.value = false;
    }
  };
</script>

<template>
  <v-container class="fill-height" fluid>
    <v-row justify="center">
      <!-- Adjust column sizes for responsiveness and use Vuetify's margin classes -->
      <v-col cols="12" sm="10" md="8" lg="4" class="ma-auto ma-sm-0 ma-sm-5">
        <v-card class="pa-4" elevation="8">
          <v-card-title class="text-h5 text-center">
            {{ $t('AuthGenerateProfile.title') }}
          </v-card-title>
          <v-form @submit.prevent="handleGenerateProfile">
            <!-- Adjust field sizes for responsiveness -->
            <v-text-field
              v-model="firstName"
              :label="$t('_Global.firstName')"
              :error-messages="errorFirstName ? [errorFirstName] : []"
              :rules="[
                (v) =>
                  !!v ||
                  $t('Error.REQUIRED', { value: $t('_Global.firstName') }),
              ]"
              required
            />
            <v-text-field
              v-model="lastName"
              :label="$t('_Global.lastName')"
              :error-messages="errorLastName ? [errorLastName] : []"
              :rules="[
                (v) =>
                  !!v ||
                  $t('Error.REQUIRED', { value: $t('_Global.lastName') }),
              ]"
              required
            />
            <v-text-field v-model="location" label="Location" required />
            <v-select
              v-model="gender"
              :items="['Male', 'Female', 'Other']"
              :rules="gender.value === '' ? ['Please select a gender'] : []"
              label="Gender"
              required
            />
            <v-text-field
              v-model="age"
              label="Age"
              type="number"
              :min="18"
              :max="99"
              required
            />
            <v-text-field
              v-model="height"
              label="Height (cm)"
              type="number"
              :min="130"
              :max="230"
              required
            />
            <v-select
              v-model="iLike"
              :items="['Male', 'Female', 'Both', 'Other']"
              label="I Like"
              required
            />
            <v-textarea v-model="bio" label="Bio" maxlength="140" required />
            <v-text-field
              v-model="interests"
              label="Interests (Hashtags)"
              hint="Example: #music, #travel, #food"
              persistent-hint
              required
            />

            <!-- Use full-width button on small screens -->
            <v-btn color="green" :loading="loading" block large type="submit">
              Generate Profile
            </v-btn>
          </v-form>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
