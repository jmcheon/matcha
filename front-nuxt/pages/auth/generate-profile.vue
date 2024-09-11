<template>
  <main class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="bg-blue-500 p-6 rounded-lg shadow-lg w-80">
      <h2 class="text-center text-xl font-bold mb-4">Generate Profile</h2>
      <form @submit.prevent="handleGenerateProfile">
        <!-- First Name -->
        <div class="mb-4">
          <label for="firstName" class="block text-sm font-medium text-gray-700"
            >First Name</label
          >
          <input
            id="firstName"
            v-model="firstName"
            type="text"
            class="mt-1 p-2 w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter your first name"
            required
          />
        </div>

        <!-- Last Name -->
        <div class="mb-4">
          <label for="lastName" class="block text-sm font-medium text-gray-700"
            >Last Name</label
          >
          <input
            id="lastName"
            v-model="lastName"
            type="text"
            class="mt-1 p-2 w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter your last name"
            required
          />
        </div>

        <!-- Location -->
        <div class="mb-4">
          <label for="location" class="block text-sm font-medium text-gray-700"
            >Location</label
          >
          <input
            id="location"
            v-model="location"
            type="text"
            class="mt-1 p-2 w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter your location"
            required
          />
        </div>

        <!-- Gender -->
        <div class="mb-4">
          <label for="gender" class="block text-sm font-medium text-gray-700"
            >Gender</label
          >
          <select
            id="gender"
            v-model="gender"
            class="mt-1 p-2 w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="" disabled>Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>

        <!-- Age -->
        <div class="mb-4">
          <label for="age" class="block text-sm font-medium text-gray-700"
            >Age</label
          >
          <input
            id="age"
            v-model="age"
            type="number"
            class="mt-1 p-2 w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter your age"
            min="18"
            max="99"
            required
          />
        </div>

        <!-- Height -->
        <div class="mb-4">
          <label for="height" class="block text-sm font-medium text-gray-700"
            >Height (cm)</label
          >
          <input
            id="height"
            v-model="height"
            type="number"
            class="mt-1 p-2 w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter your height"
            min="130"
            max="230"
            required
          />
        </div>

        <!-- I Like -->
        <div class="mb-4">
          <label for="iLike" class="block text-sm font-medium text-gray-700"
            >I Like</label
          >
          <select
            id="iLike"
            v-model="iLike"
            class="mt-1 p-2 w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="" disabled>Select Preference</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="both">Both</option>
            <option value="other">Other</option>
          </select>
        </div>

        <!-- Bio -->
        <div class="mb-4">
          <label for="bio" class="block text-sm font-medium text-gray-700"
            >Bio</label
          >
          <textarea
            id="bio"
            v-model="bio"
            maxlength="140"
            class="mt-1 p-2 w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            placeholder="Write something about yourself (140 characters max)"
            required
          ></textarea>
        </div>

        <!-- Interests (Hashtags) -->
        <div class="mb-4">
          <label for="interests" class="block text-sm font-medium text-gray-700"
            >Interests (Hashtags)</label
          >
          <input
            id="interests"
            v-model="interests"
            type="text"
            class="mt-1 p-2 w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter interests separated by commas"
            required
          />
          <div class="mt-2 text-sm text-gray-500">
            Example: #music, #travel, #food
          </div>
        </div>

        <button
          type="submit"
          class="w-full px-4 py-2 bg-green-500 text-white font-semibold rounded-md shadow-md"
        >
          Generate Profile
        </button>
      </form>
    </div>
  </main>
</template>

<script setup>
  import { ref } from 'vue';

  definePageMeta({
    // layout: 'auth',
    middleware: ['strict-auth'],
  });
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
  const axios = useAxios();
  const { generateProfile } = useProfile();

  const handleGenerateProfile = async () => {
    // Validate the form before submission
    if (
      !firstName.value ||
      !lastName.value ||
      !location.value ||
      !gender.value ||
      !iLike.value ||
      !bio.value ||
      !interests.value
    ) {
      // eslint-disable-next-line no-alert
      alert('Please fill in all fields.');
      return;
    }

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
      // Make API call to save profile data
      console.log('Profile Data:', profileData);
      // await saveProfile(profileData);
      await generateProfile(axios, profileData);
      // eslint-disable-next-line no-alert
      alert('Profile generated successfully!');
      // Redirect or handle success
      await navigateTo({ path: localePath('index') });
    } catch (error) {
      console.error('Error generating profile:', error);
      // eslint-disable-next-line no-alert
      alert('Error generating profile.');
    }
  };
</script>

<style>
  main {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>
