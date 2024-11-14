<template>
  <TipsWrapper />
  <v-card flat>
    <v-card-title class="d-flex align-center pe-2">
      <v-icon
        icon="mdi-information-outline"
        class="text-start font-weight-semibold text-primary"
      ></v-icon>
      &nbsp;&nbsp;&nbsp; FIND TIPS&nbsp;&nbsp;&nbsp;&nbsp;

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

    <!-- Loading indicator -->
    <v-row v-if="loading" align="center" justify="center">
      <v-progress-circular
        indeterminate
        color="primary"
        size="64"
      ></v-progress-circular>
    </v-row>

    <!-- Data Table -->
    <v-data-table
      v-model:search="search"
      :items="items"
      :items-per-page="3"
      :headers="headers"
      hover
      v-else
    >
      <template #header.image>
        <div class="text-start font-weight-semibold text-primary">Image</div>
      </template>
      <template #header.title>
        <div class="text-start font-weight-semibold text-primary">Title</div>
      </template>
      <template #header.description>
        <div class="text-start font-weight-semibold text-primary">
          Description
        </div>
      </template>
      <template #header.added_by>
        <div class="text-start font-weight-semibold text-primary">Added By</div>
      </template>
      <template #header.date_added>
        <div class="text-start font-weight-semibold text-primary">
          Date Added
        </div>
      </template>
      <template #header.actions>
        <div class="text-start font-weight-semibold text-primary">Actions</div>
      </template>

      <template #item.actions="{ item }">
        <div class="icon-container">
          <div class="delete">
            <v-icon
              icon="mdi-delete"
              pa="7"
              color="red"
              class="icon"
              @click="deleteTip(item.tips_id)"
            ></v-icon>
          </div>

          <div class="edit">
            <router-link :to="`/tips/${item.tips_id}`">
              <v-icon icon="mdi-pencil" pa="7" class="icon" color="blue">
              </v-icon>
            </router-link>
          </div>
        </div>
      </template>

      <template #item.image="{ item }">
        <v-card class="my-2" elevation="2" rounded style="width: 80px">
          <img
            :src="`http://localhost:5000/imgs/${item.image}`"
            width="80"
            height="80"
            @click="showImageDialog(item.image)"
            style="cursor: pointer"
          />
        </v-card>
      </template>

      <template #item.date_added="{ item }">
        <div>{{ formatDate(item.date_added) }}</div>
      </template>
    </v-data-table>

    <!-- Image Dialog -->
    <v-dialog v-model="dialog" max-width="500px">
      <v-card style="padding: 10px">
        <v-img
          :src="`http://localhost:5000/imgs/${selectedImage}`"
          height="400px"
        />
        <v-card-actions>
          <v-btn text @click="dialog = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script setup>
import TipsWrapper from "@/components/tipsWrapper.vue";
import axios from "axios";
import { onMounted, ref } from "vue";
import { useToast } from "vue-toastification";
import Swal from "sweetalert2";

const loading = ref(true);
const toast = useToast();

const search = ref("");
const items = ref([]);
const dialog = ref(false);
const selectedImage = ref("");

const headers = ref([
  { text: "Image", value: "image" },
  { text: "Title", value: "title" },
  { text: "Description", value: "description" },
  { text: "Added By", value: "added_by" },
  { text: "Date Added", value: "date_added" },
  { text: "Actions", value: "actions" },
]);

// Fetch data function with error handling
const fetchData = async () => {
  try {
    const response = await axios.get("http://localhost:5000/tips");
    items.value = response.data;
  } catch (error) {
    console.error(error);
    toast.error("Error fetching data.");
  } finally {
    loading.value = false;
  }
};

// Fetch data on component mount
onMounted(fetchData);

// Delete tip with confirmation
const deleteTip = async (tips_id) => {
  try {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You want to delete this tip!",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: '<span style="color: white">Yes, delete it!</span>',
      cancelButtonText: '<span style="color: white">Cancel</span>',
    });

    if (result.isConfirmed) {
      await axios.delete(`http://localhost:5000/tips/${tips_id}`);
      toast.success("Deleted successfully");
      fetchData(); // Refresh the data after deletion
    }
  } catch (err) {
    console.error(err);
    toast.error("Error deleting tip");
  }
};

// Format the date
const formatDate = (date) => {
  const formattedDate = new Date(date);
  const day = formattedDate.getDate().toString().padStart(2, "0");
  const month = (formattedDate.getMonth() + 1).toString().padStart(2, "0");
  const year = formattedDate.getFullYear();
  return `${day}/${month}/${year}`;
};

// Show image dialog
const showImageDialog = (image) => {
  selectedImage.value = image;
  dialog.value = true;
};
</script>

<style scoped>
* {
  overflow: hidden;
}

.icon-container {
  display: flex;
  align-items: center;
  gap: 8px;
}

.icon {
  padding: 7px;
  border-radius: 50%;
  background-color: rgba(0, 0, 0, 0.05);
  cursor: pointer;
  transition: background-color 0.3s;
}

.icon:hover {
  background-color: rgba(0, 0, 0, 0.1);
}
</style>
