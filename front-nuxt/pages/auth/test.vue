<template>
  <v-container class="h-screen flex flex-col justify-center items-center">
    <!-- First Row: Selected Index Text -->
    <div class="text-center text-xl font-bold mb-4">
      Selected Index: {{ selectedIndex }}
    </div>

    <!-- Second Row: 5 Navigable Vuetify Buttons -->
    <div class="flex space-x-4 mb-8">
      <v-btn
        v-for="(item, index) in items"
        :key="index"
        class="w-16 h-16 flex items-center justify-center"
        :class="{
          'border-2 border-red-500': selectedIndex === index,
          'border-2 border-gray-300': selectedIndex !== index,
        }"
        elevation="0"
        outlined
        @click="selectedIndex = index"
      >
        {{ index }}
      </v-btn>
    </div>

    <!-- Bottom Row: OK Button -->
    <v-btn
      color="primary"
      class="text-white px-6 py-2 rounded-lg"
      @click="confirmSelection"
    >
      OK
    </v-btn>
  </v-container>
</template>

<script>
  export default {
    data() {
      return {
        selectedIndex: 0,
        items: Array.from({ length: 5 }), // Array with 5 items for selection
      };
    },
    methods: {
      confirmSelection() {
        alert(`You selected: ${this.selectedIndex + 1}`);
      },
    },
  };
</script>
