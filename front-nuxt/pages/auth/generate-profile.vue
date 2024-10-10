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
            <v-text-field
              v-model="location"
              label="Location"
              required
              readonly
            />
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
              v-model:search="search"
              :items="availableInterests"
              label="Interests"
              multiple
              chips
              clearable
              required
              :rules="[(v) => !!v.length || 'Please add at least one interest']"
              :menu-props="{ persistent: true }"
              no-filter
              @keydown.enter.prevent="handleAddInterestEnter"
            >
              <template #append-item>
                <v-list-item v-if="canAddNewInterest" @click="addNewInterest">
                  <v-list-item-title>
                    Add new interest '{{ search }}'
                  </v-list-item-title>
                </v-list-item>
              </template>
            </v-combobox>
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

  const axios = useAxios();

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
  const availableInterests = ref([]);
  const unlistedInterests = ref([]); // List to keep track of unlisted interests
  const search = ref('');

  const { t } = useI18n();
  const { generateProfile, getInterests } = useProfile();
  const { profileData } = storeToRefs(useUserStore());

  const { firstNameValidator, lastNameValidator, bioValidator } =
    useValidator();
  const { error: errorFirstName } = firstNameValidator(dirty, firstName, t);
  const { error: errorLastName } = lastNameValidator(dirty, lastName, t);
  const { error: errorBio } = bioValidator(dirty, bio, t);

  const getGeolocation = () => {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            console.log(
              'User granted geolocation permission:',
              latitude,
              longitude,
            );
            resolve({ lat: latitude, lng: longitude });
          },
          (error) => {
            console.error(
              'User denied geolocation permission or an error occurred:',
              error,
            );
            reject(error);
          },
        );
      } else {
        reject(new Error('Geolocation is not supported by this browser.'));
      }
    });
  };

  const getIpLocation = async () => {
    try {
      const response = await axios.get('/api/profile/location');
      if (response && response.data.uinfo) {
        console.log('Location retrieved from IP:', response.data.uinfo);
        return response.data.uinfo;
      } else {
        throw new Error('Unable to retrieve IP-based location');
      }
    } catch (error) {
      console.error('Error getting IP-based location:', error);
      throw error;
    }
  };

  const getUserLocation = async () => {
    try {
      loading.value = true;
      const loc = await getGeolocation();
      location.value = `${loc.lat}, ${loc.lng}`;
    } catch (error) {
      console.log('Falling back to IP-based location');
      try {
        const ipLoc = await getIpLocation();
        location.value = `${ipLoc.lat}, ${ipLoc.lng}`;
      } catch (err) {
        location.value = 'Unknown Location';
      }
    } finally {
      loading.value = false;
    }
  };

  onMounted(async () => {
    getUserLocation();
    try {
      const fetchedInterests = await getInterests();
      console.log('response val', fetchedInterests);
      availableInterests.value = fetchedInterests;
      console.log('response interest', availableInterests.value);
    } catch (error) {
      console.error('Error fetching interests:', error);
    }
  });

  watch(search, (newValue) => {
    console.log('Search value:', newValue);
  });

  const handleAddInterestEnter = () => {
    console.log('bitch');
    // const interest = search.value.trim();
    // interests.value.push(interest);
    // unlistedInterests.value.push(interest);
    search.value = ''; // Clear the search value
    // console.log('Added new interest and cleared search:', interest);
  };

  const canAddNewInterest = computed(() => {
    const searchValue = search.value;
    const existsInAvailable = interestExists(
      searchValue,
      availableInterests.value,
    );
    const existsInInterests = interestExists(searchValue, interests.value);
    const result =
      searchValue.length > 0 ? !existsInAvailable && !existsInInterests : false;
    console.log('--- Debugging canAddNewInterest ---');
    console.log('Search Value:', searchValue);
    console.log('Exists in Available Interests:', existsInAvailable);
    console.log('Exists in User Interests:', existsInInterests);
    console.log('Can Add New Interest:', result);
    console.log('--- Debugging canAddNewInterest ---');

    return result;
  });

  const interestExists = (interest, list) => {
    const exists = list.some(
      (item) => item.toLowerCase() === interest.toLowerCase(),
    );
    console.log(`Checking if "${interest}" exists in list:`, exists);
    return exists;
  };

  const addNewInterest = () => {
    const interest = search.value.trim();
    if (canAddNewInterest.value) {
      interests.value.push(interest);
      unlistedInterests.value.push(interest);
      search.value = '';
    }
  };

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
      first_name: firstName.value,
      last_name: lastName.value,
      location: location.value,
      age: age.value,
      gender: gender.value,
      height: height.value,
      like_gender: iLike.value,
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
