// stores/dataStore.js
import { defineStore } from 'pinia';
import axios from 'axios';

export const useDataStore = defineStore('dataStore', {
  state: () => ({
    items: [],
  }),
  actions: {
    async getServices() {
      try {
        const response = await axios.get('http://localhost:5000/services');
        this.items = response.data; // Store data directly
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    },
  },
});
