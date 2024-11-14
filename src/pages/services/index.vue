<template>
  <homeWraper :fetch="fetchData" :data="items" />

  <v-card flat>
    <v-card-title class="d-flex align-center pe-2">
      <v-icon
        icon="mdi-briefcase-outline"
        class="text-start font-weight-semibold text-primary"
      ></v-icon>
      &nbsp;&nbsp;&nbsp; FIND SERVICES&nbsp;&nbsp;&nbsp;&nbsp;

      <v-spacer></v-spacer>

      <v-text-field
        v-model="search"
        density="compact"
        label="Search..."
        prepend-inner-icon="mdi-magnify"
        variant="solo-filled"
        flat
        hide-details
        single-line
      ></v-text-field>
    </v-card-title>

    <v-divider></v-divider>

    <v-data-table
      v-model:search="search"
      :items="items"
      :items-per-page="3"
      :headers="headers"
      class="elevation-1 my-4 custom-table"
      hover
      dense
    >
      <!-- Headers -->
      <template #header.service_name>
        <div class="text-start font-weight-semibold text-primary">
          Service Name
        </div>
      </template>
      <template #header.image>
        <div class="text-start font-weight-semibold text-primary">Image</div>
      </template>
      <template #header.descripton>
        <div class="text-start font-weight-semibold text-primary">
          Description
        </div>
      </template>
      <template #header.status>
        <div class="text-start font-weight-semibold text-primary">Status</div>
      </template>
      <template #header.date_added>
        <div class="text-start font-weight-semibold text-primary">
          Date Added
        </div>
      </template>
      <template #header.actions>
        <div class="text-start font-weight-semibold text-primary">Actions</div>
      </template>

      <!-- Item Image -->
      <template #item.image="{ item }">
        <v-card class="my-2 mx-auto elevation-2 rounded-lg" style="width: 80px">
          <v-img
            :src="`http://localhost:5000/imgs/${item.image}`"
            width="80"
            height="80"
            class="rounded hover-image"
            alt="Service Image"
            @click="openImageDialog(item.image)"
            style="cursor: pointer"
          ></v-img>
        </v-card>
      </template>

      <!-- Item Actions -->
      <template #item.actions="{ item }">
        <div class="d-flex justify-start icon-container">
          <v-icon
            class="icon-delete"
            @click="deleteService(item.id)"
            title="Delete"
          >
            mdi-delete
          </v-icon>

          <router-link :to="`/services/${item.id}`" title="Edit">
            <v-icon class="icon-edit">mdi-pencil</v-icon>
          </router-link>
        </div>
      </template>

      <!-- Item Status -->
      <template #item.status="{ item }">
        <v-chip
          :color="item.status === 'Active' ? 'success' : 'error'"
          dark
          small
          class="text-capitalize px-3"
        >
          {{ item.status }}
        </v-chip>
      </template>

      <!-- Item Date Added -->
      <template #item.date_added="{ item }">
        <div class="text-start">
          {{ formatDate(item.date_added) }}
        </div>
      </template>
    </v-data-table>
  </v-card>

  <!-- Image Dialog -->
  <v-dialog v-model="imageDialog" max-width="500px">
    <v-card style="padding: 10px">
      <v-img
        :src="`http://localhost:5000/imgs/${currentImage}`"
        height="400px"
        width="100%"
      ></v-img>

      <v-card-actions>
        <v-btn color="primary" text @click="imageDialog = false"> Close </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import homeWraper from "@/components/homeWraper.vue";
import { useDataStore } from "@/stores/dataStore";
import api from "@/axios";
import axios from "axios";
import { onMounted, ref, defineProps } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useToast } from "vue-toastification";
import Swal from "sweetalert2";

const toast = useToast();
const loading = ref(true);
let items = ref([]);
const search = ref("");
const headers = ref([
  { text: "Name", value: "service_name" },
  { text: "Image", value: "image" },
  { text: "Description", value: "descripton" },
  { text: "Status", value: "status" },
  { text: "Date Added", value: "date_added" },
  { text: "Actions", value: "actions" },
]);

// Fetch data function
const fetchData = async () => {
  try {
    const response = await api.get("/services");
    items.value = response.data; // Assuming response data is an array of items
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};

// Fetch data on mount
onMounted(fetchData);

const deleteService = async (id) => {
  try {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You wan't to delete this!",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: '<span style="color: white">Yes, delete it!</span>',
      cancelButtonText: '<span style="color: white">Cancel</span>',
    });

    if (result.isConfirmed) {
      await axios.delete(`http://localhost:5000/services/${id}`);
      fetchData();
      toast.success("Deleted Sucessfully");
    }
  } catch (err) {
    console.log(err);
  }
};

// Dialog state for images
const imageDialog = ref(false);
const currentImage = ref("");
const openImageDialog = (image) => {
  currentImage.value = image;
  imageDialog.value = true;
};

const formatDate = (date) => {
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, "0"); // Ensure day is 2 digits
  const month = String(d.getMonth() + 1).padStart(2, "0"); // Ensure month is 2 digits (getMonth() is zero-based)
  const year = d.getFullYear();

  return `${day}/${month}/${year}`;
};
</script>
<style scoped>
* {
  overflow: hidden;
}

.icon-container {
  display: flex;
  align-items: center;
  gap: 8px; /* Space between icons */
}

.icon {
  padding: 7px;
  border-radius: 50%;
  background-color: rgba(0, 0, 0, 0.05);
  cursor: pointer;
  transition: background-color 0.3s;
}

.icon-container {
  gap: 12px; /* Adds spacing between the icons */
}

.icon-delete,
.icon-edit {
  font-size: 24px; /* Slightly larger for visibility */
  cursor: pointer;
  transition: transform 0.2s ease, color 0.2s ease;
}

.icon-delete {
  color: red; /* Softer red color */
}

.icon-edit {
  color: blue; /* Softer blue color */
}

.icon-delete:hover {
  color: #d32f2f; /* Darker red on hover */
  transform: scale(1.15);
}

.icon-edit:hover {
  color: #1976d2; /* Darker blue on hover */
  transform: scale(1.15);
}

.icon:hover {
  background-color: rgba(0, 0, 0, 0.1); /* Darker on hover */
}

.custom-table {
  background-color: #fdfdfd;
  border-radius: 8px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  padding: 20px; /* Padding for table */
}

.text-primary {
  color: #1e88e5;
}

.font-weight-semibold {
  font-weight: 600;
}

.v-chip.success {
  background-color: #4caf50 !important;
  color: white !important;
}

.v-chip.error {
  background-color: #f44336 !important;
  color: white !important;
}

/* Modal (v-dialog) specific styles */
.v-dialog {
  padding: 30px; /* Increased padding for the modal */
}
</style>
