<template>
  <v-card flat class="p-4 custom-card">
    <v-card-title class="d-flex align-center pe-2">
      <v-icon
        icon="mdi-account-group"
        class="me-2 text-start font-weight-semibold text-primary"
      ></v-icon>
      Find User
      <v-spacer></v-spacer>
      <v-text-field
        v-model="search"
        density="compact"
        label="Search"
        prepend-inner-icon="mdi-magnify"
        variant="solo-filled"
        hide-details
        single-line
        flat
        class="search-bar"
      ></v-text-field>
    </v-card-title>

    <v-divider></v-divider>

    <!-- Data Table -->
    <v-data-table
      v-model:search="search"
      :items="items"
      :items-per-page="5"
      :headers="headers"
      class="elevation-1 custom-table"
      hover
      dense
    >
      <!-- Headers -->
      <template #header.profileImage>
        <div class="text-start font-weight-semibold text-secondary">
          Profile Image
        </div>
      </template>
      <template #header.name>
        <div class="text-start font-weight-semibold text-secondary">Name</div>
      </template>
      <template #header.contact>
        <div class="text-start font-weight-semibold text-secondary">
          Contact
        </div>
      </template>
      <template #header.email>
        <div class="text-start font-weight-semibold text-secondary">Email</div>
      </template>
      <template #header.date_created>
        <div class="text-start font-weight-semibold text-secondary">
          Date Added
        </div>
      </template>

      <!-- Profile Image with Dialog -->
      <template #item.profileImage="{ item }">
        <v-card
          class="my-2 mx-auto elevation-2 rounded-circle profile-image-card"
          @click="openImageDialog(item.profileImage)"
        >
          <v-img
            :src="getProfileImage(item.profileImage)"
            alt="Profile Image"
            class="profile-image"
          ></v-img>
        </v-card>
      </template>

      <!-- Item Data -->
      <template #item.name="{ item }">
        <div class="text-start">{{ item.name }}</div>
      </template>
      <template #item.contact="{ item }">
        <div class="text-start">{{ item.contact }}</div>
      </template>
      <template #item.email="{ item }">
        <div class="text-start">{{ item.email }}</div>
      </template>
      <template #item.date_created="{ item }">
        <div class="text-start">{{ formatDate(item.date_created) }}</div>
      </template>
    </v-data-table>

    <!-- Image Dialog -->
    <v-dialog v-model="dialog" max-width="500px">
      <v-card style="padding: 10px">
        <v-card-title>
          <span class="headline">Profile Image</span>
        </v-card-title>
        <v-img
          :src="dialogImage"
          alt="Profile Image"
          height="350px"
          width="100%"
        ></v-img>
        <v-card-actions>
          <v-btn color="primary" text @click="dialog = false"> Close </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script setup>
import { ref, onMounted } from "vue";
import api from "@/axios";
import axios from "axios";

const search = ref("");
const items = ref([]);
const loading = ref(true);
const dialog = ref(false);
const dialogImage = ref("");

// Define headers
const headers = ref([
  { text: "Profile Image", value: "profileImage" },
  { text: "Name", value: "name" },
  { text: "Contact", value: "contact" },
  { text: "Email", value: "email" },
  { text: "Date Added", value: "date_created" },
]);

// Fetch data from the server
const fetchData = async () => {
  try {
    const response = await api.get("/allusers");
    // const response = await axios.get("/allusers");
    items.value = response.data;
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};

const formatDate = (dateString) => {
  if (!dateString) return "N/A";

  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "N/A";

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
};

// Display profile image or default image
const getProfileImage = (imageUrl) => {
  return imageUrl ? `http://localhost:5000${imageUrl}` : "/avater.jpg";
};

// Open dialog with image
const openImageDialog = (imageUrl) => {
  dialogImage.value = getProfileImage(imageUrl);
  dialog.value = true;
};

// Load data when component is mounted
onMounted(fetchData);
</script>

<style scoped>
.custom-card {
  background-color: #f8f9fa;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.text-secondary {
  color: #6c757d;
}

.font-weight-semibold {
  font-weight: 600;
}

.profile-image-card {
  width: 60px;
  height: 60px;
  overflow: hidden;
  cursor: pointer;
}

.profile-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.profile-image:hover {
  transform: scale(1.1);
  box-shadow: 0px 8px 15px rgba(0, 0, 0, 0.2);
}

.search-bar {
  max-width: 250px;
  margin-left: auto;
}
</style>
