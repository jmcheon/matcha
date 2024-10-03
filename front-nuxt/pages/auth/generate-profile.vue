<template>
  <v-container class="fill-height" fluid>
    <v-row justify="center">
      <v-col cols="12" sm="10" md="8" lg="4" class="ma-auto ma-sm-0 ma-sm-5">
        <v-card class="pa-4" elevation="8">
          <v-card-title class="text-h5 text-center">
            {{ $t('AuthGenerateProfile.title') }}
          </v-card-title>
          <v-form @submit.prevent="handleGenerateProfile">
            <v-text-field
              v-model="firstName"
              :label="$t('_Global.firstName')"
              :error="!!errorFirstName"
              :messages="[errorFirstName]"
              required
            />
            <v-text-field
              v-model="lastName"
              :label="$t('_Global.lastName')"
              :error="!!errorLastName"
              :messages="[errorLastName]"
              required
            />
            <v-text-field v-model="location" label="Location" required />
            <v-select
              v-model="gender"
              :items="['Male', 'Female', 'Other']"
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
            <v-textarea
              v-model="bio"
              :label="$t('_Global.bio')"
              :error="!!errorBio"
              :messages="[errorBio]"
              required
            />
            <v-combobox
              v-model="interests"
              :items="availableInterests"
              label="Interests (Hashtags)"
              multiple
              chips
              clearable
              required
              :rules="[(v) => !!v.length || 'Please add at least one interest']"
            />
            <v-btn color="green" :loading="loading" block large type="submit">
              Generate Profile
            </v-btn>
          </v-form>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
  import { ref } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { storeToRefs } from 'pinia';
  // ... other imports ...

  definePageMeta({
    middleware: ['strict-auth'],
  });

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
  const interests = ref([]);
  const availableInterests = ref([
    '#music',
    '#travel',
    '#food',
    '#sports',
    '#art',
    // Add more predefined interests if desired
  ]);

  const { t } = useI18n();
  const { generateProfile } = useProfile();
  const { profileData } = storeToRefs(useUserStore());

  const { firstNameValidator, lastNameValidator, bioValidator } =
    useValidator();
  const { error: errorFirstName } = firstNameValidator(dirty, firstName, t);
  const { error: errorLastName } = lastNameValidator(dirty, lastName, t);
  const { error: errorBio } = bioValidator(dirty, bio, t);

  const handleGenerateProfile = async () => {
    dirty.value = true;
    if (
      errorFirstName.value ||
      errorLastName.value ||
      !location.value ||
      !gender.value ||
      !iLike.value ||
      errorBio.value ||
      interests.value.length === 0
    ) {
      return;
    }

    const generatedProfile = {
      firstName: firstName.value,
      lastName: lastName.value,
      location: location.value,
      gender: gender.value,
      age: age.value,
      height: height.value,
      iLike: iLike.value,
      bio: bio.value,
      interests: interests.value,
    };

    try {
      loading.value = true;
      errorGlobal.value = '';
      const generatedResult = await generateProfile(generatedProfile);
      profileData.value = generatedResult;
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
