<template>
  <main class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="bg-white p-6 rounded-lg shadow-lg w-96">
      <h2 class="text-center text-xl font-bold mb-4">Generate Profile</h2>
      <form @submit.prevent="handleSubmit">
        <!-- Gender Radio -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700">Gender</label>
          <div class="flex items-center space-x-4 mt-1">
            <label
              ><input v-model="gender" type="radio" value="male" /> Male</label
            >
            <label
              ><input v-model="gender" type="radio" value="female" />
              Female</label
            >
            <label
              ><input v-model="gender" type="radio" value="other" />
              Other</label
            >
          </div>
        </div>

        <!-- Age Slider -->
        <div class="mb-4">
          <label for="age" class="block text-sm font-medium text-gray-700"
            >Age: {{ age }}</label
          >
          <input
            id="age"
            v-model="age"
            type="range"
            min="18"
            max="100"
            class="w-full"
          />
        </div>

        <!-- Height Input Box -->
        <div class="mb-4">
          <label for="height" class="block text-sm font-medium text-gray-700"
            >Height (cm)</label
          >
          <input
            id="height"
            v-model="height"
            type="number"
            min="100"
            max="250"
            class="mt-1 p-2 w-full border border-gray-300 rounded-md shadow-sm"
            placeholder="Enter your height"
          />
        </div>

        <!-- "I Like" Radio -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700">I Like</label>
          <div class="flex items-center space-x-4 mt-1">
            <label
              ><input v-model="iLike" type="radio" value="male" /> Male</label
            >
            <label
              ><input v-model="iLike" type="radio" value="female" />
              Female</label
            >
            <label
              ><input v-model="iLike" type="radio" value="both" /> Both</label
            >
            <label
              ><input v-model="iLike" type="radio" value="other" /> Other</label
            >
          </div>
        </div>

        <!-- Bio Input Box -->
        <div class="mb-4">
          <label for="bio" class="block text-sm font-medium text-gray-700"
            >Bio (140 characters max)</label
          >
          <textarea
            id="bio"
            v-model="bio"
            maxlength="140"
            rows="3"
            class="mt-1 p-2 w-full border border-gray-300 rounded-md shadow-sm"
            placeholder="Write something about yourself"
          ></textarea>
        </div>

        <!-- Interested Hashtags -->
        <div class="mb-4">
          <label for="hashtags" class="block text-sm font-medium text-gray-700"
            >Interested Hashtags</label
          >
          <input
            id="hashtags"
            v-model="hashtags"
            class="mt-1 p-2 w-full border border-gray-300 rounded-md shadow-sm"
            placeholder="Enter hashtags (comma separated)"
          />
        </div>

        <button
          type="submit"
          class="w-full px-4 py-2 bg-blue-500 text-white font-semibold rounded-md shadow-md"
        >
          Generate Profile
        </button>
      </form>
    </div>
  </main>
</template>

<script setup>
  import { ref } from 'vue';

  const gender = ref('male'); // Default gender
  const age = ref(18); // Default age value for the slider
  const height = ref(170); // Default height value in cm
  const iLike = ref('female'); // Default preference
  const bio = ref(''); // Bio, limited to 140 characters
  const hashtags = ref(''); // Input for hashtags

  // Handle form submission
  const handleSubmit = () => {
    console.log({
      gender: gender.value,
      age: age.value,
      height: height.value,
      iLike: iLike.value,
      bio: bio.value,
      hashtags: hashtags.value.split(',').map((tag) => tag.trim()), // Convert to array of hashtags
    });

    // Add further logic like sending data to the backend
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
