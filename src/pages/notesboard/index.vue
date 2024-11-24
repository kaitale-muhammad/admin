<template>
  <NoteBoard />
  <v-card flat>
    <v-card-title class="d-flex align-center pe-2">
      <v-icon
        icon="mdi-note-outline"
        class="text-start font-weight-semibold text-primary"
      ></v-icon>
      &nbsp;&nbsp;&nbsp; FIND NOTES&nbsp;&nbsp;&nbsp;&nbsp;

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
      hover
    >
      <!-- Custom Headers with Blue Color -->
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

      <template #item.actions="{ item }">
        <div class="icon-container">
          <div class="delete">
            <v-icon
              icon="mdi-delete"
              pa="7"
              color="red"
              class="icon"
              @click="deleteService(item.notes_id)"
            ></v-icon>
          </div>

          <div class="edit">
            <router-link :to="`/notesboard/${item.notes_id}`">
              <v-icon
                icon="mdi-pencil"
                pa="7"
                class="icon"
                color="blue"
              ></v-icon>
            </router-link>
          </div>
        </div>
      </template>

      <!-- Image with Click Event to Show Larger View -->
      <template #item.image="{ item }">
        <v-card
          class="my-2"
          elevation="2"
          rounded
          style="width: 80px"
          @click="openImageModal(item.image)"
        >
          <img
            :src="`https://backendpsl.up.railway.app/uploads/${item.image}`"
            width="80"
            height="80"
            style="cursor: pointer"
          />
        </v-card>
      </template>

      <!-- Date Formatting -->
      <template #item.date_added="{ item }">
        <div>{{ formatDate(item.date_added) }}</div>
      </template>
    </v-data-table>
  </v-card>

  <!-- Image Modal -->
  <v-dialog v-model="showImageModal" max-width="500px">
    <v-card style="padding: 10px">
      <!-- <v-card-title>
        <span class="headline">Image View</span>
      </v-card-title> -->
      <v-card-text>
        <v-img :src="imageModalSrc" height="400px" width="100%" />
      </v-card-text>
      <v-card-actions>
        <v-btn text @click="showImageModal = false">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script setup>
import api from "@/axios";
import { onMounted, ref } from "vue";
import { useToast } from "vue-toastification";
import Swal from "sweetalert2";

// Reactive references
const loading = ref(true);
const toast = useToast();
const search = ref("");
const items = ref([]);
const showImageModal = ref(false);
const imageModalSrc = ref("");

// Headers for the table
const headers = ref([
  { text: "Image", value: "image" },
  { text: "Title", value: "title" },
  { text: "Description", value: "description" },
  { text: "Added By", value: "added_by" },
  { text: "Date Added", value: "date_added" },
  { text: "Actions", value: "actions" },
]);

// Fetch data from API
const fetchData = async () => {
  try {
    const response = await api.get("/notesboard");
    items.value = response.data; // Assuming response data is an array of items
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};

// Fetch data when the component mounts
onMounted(fetchData);

// Delete service function
const deleteService = async (id) => {
  try {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You want to delete this!",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: '<span style="color: white">Yes, delete it!</span>',
      cancelButtonText: '<span style="color: white">Cancel</span>',
    });

    if (result.isConfirmed) {
      await api.delete(`/notesboard/${id}`);
      fetchData();
      toast.success("Deleted successfully");
    }
  } catch (err) {
    console.log(err);
  }
};

// Function to open image modal
const openImageModal = (image) => {
  imageModalSrc.value = `https://backendpsl.up.railway.app/uploads/${image}`;
  showImageModal.value = true;
};

// Function to format date as day/month/year
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

.v-card img {
  cursor: pointer;
}
</style>
