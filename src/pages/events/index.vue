<template>
  <EventWrapper />
  <v-card flat>
    <v-card-title class="d-flex align-center pe-2">
      <v-icon
        icon="mdi-calendar"
        class="text-start font-weight-semibold text-primary"
      ></v-icon>
      &nbsp;&nbsp;&nbsp; FIND EVENTS&nbsp;&nbsp;&nbsp;&nbsp;

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
      <!-- event_id, image, title, description, added_by, date_added, date_to_occur -->
      <template #header.image>
        <div class="text-start header-blue">Image</div>
      </template>
      <template #header.title>
        <div class="text-start header-blue">Title</div>
      </template>
      <template #header.description>
        <div class="text-start header-blue">Description</div>
      </template>
      <template #header.added_by>
        <div class="text-start header-blue">Added By</div>
      </template>
      <template #header.date_added>
        <div class="text-start header-blue">Date Added</div>
      </template>
      <template #header.date_to_occur>
        <div class="text-start header-blue">Date To Occur</div>
      </template>

      <template #item.actions="{ item }">
        <div class="icon-container">
          <div class="delete">
            <v-icon
              icon="mdi-delete"
              pa="7"
              color="red"
              class="icon"
              @click="deleteEvent(item.event_id)"
            ></v-icon>
          </div>

          <div class="edit">
            <router-link :to="`/events/${item.event_id}`">
              <v-icon icon="mdi-pencil" pa="7" class="icon" color="blue">
              </v-icon>
            </router-link>
          </div>
        </div>
      </template>

      <template #item.image="{ item }">
        <v-card class="my-2" elevation="2" rounded style="width: 80px">
          <img
            :src="`https://backendpsl.up.railway.app/uploads/${item.image}`"
            width="80"
            height="80"
            @click="
              openImageDialog(
                `https://backendpsl.up.railway.app/uploads/${item.image}`
              )
            "
          />
        </v-card>
      </template>

      <template #item.date_added="{ item }">
        <div class="text-start">{{ formatDate(item.date_added) }}</div>
      </template>

      <template #item.date_to_occur="{ item }">
        <div class="text-start">{{ formatDate(item.date_to_occur) }}</div>
      </template>
    </v-data-table>
  </v-card>

  <!-- Image Dialog -->
  <v-dialog v-model="imageDialog" max-width="500px">
    <v-card style="padding: 10px">
      <v-img :src="imageDialogSrc" height="400px" width="100%" />
      <v-card-actions>
        <v-btn color="primary" text @click="imageDialog = false"> Close </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import EventWrapper from "@/components/eventWrapper.vue";
import api from "@/axios";
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import { useToast } from "vue-toastification";
import Swal from "sweetalert2";

const loading = ref(true);
const toast = useToast();
const route = useRoute();
const event_id = route.params.id;

const search = ref("");
const items = ref([]);

// Define the headers for the table
const headers = ref([
  { text: "Image", value: "image" },
  { text: "Title", value: "title" },
  { text: "Description", value: "description" },
  { text: "Added By", value: "added_by" },
  { text: "Date Added", value: "date_added" },
  { text: "Date To Occur", value: "date_to_occur" },
  { text: "Actions", value: "actions" },
]);

// Fetch data from the API
const fetchData = async () => {
  try {
    const response = await api.get("/events");
    items.value = response.data; // Assuming response data is an array of items
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};

// Fetch data on component mount
onMounted(fetchData);

// Delete event handler
const deleteEvent = async (event_id) => {
  try {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You want to delete this event!",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: '<span style="color: white">Yes, delete it!</span>',
      cancelButtonText: '<span style="color: white">Cancel</span>',
    });

    if (result.isConfirmed) {
      await api.delete(`/events/${event_id}`);
      toast.success("Deleted successfully");
      fetchData(); // Reload or fetch updated data
    }
  } catch (err) {
    console.error(err);
    toast.error("Error deleting event");
  }
};

// Format the date as day/month/year
const formatDate = (date) => {
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
};

// Image dialog logic
const imageDialog = ref(false);
const imageDialogSrc = ref("");

const openImageDialog = (src) => {
  imageDialogSrc.value = src;
  imageDialog.value = true;
};
</script>

<style scoped>
.header-blue {
  color: #1e88e5; /* Blue color */
  font-weight: bold;
}

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
