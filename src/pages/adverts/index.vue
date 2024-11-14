<template>
  <advertWrapper />
  <v-card flat>
    <v-card-title class="d-flex align-center pe-2">
      <v-icon
        icon="mdi-equal-box"
        class="text-start font-weight-semibold text-primary"
      ></v-icon>
      &nbsp;&nbsp;&nbsp; FIND ADVERT&nbsp;&nbsp;&nbsp;&nbsp;

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
      <template #header.image>
        <div class="text-start font-weight-semibold text-primary">Image</div>
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
              @click="deleteAdvert(item.advert_id)"
            ></v-icon>
          </div>

          <div class="edit">
            <router-link :to="`/adverts/${item.advert_id}`">
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
            @click="openImageDialog(item.image)"
          />
        </v-card>
      </template>

      <template #item.date_added="{ item }">
        <div>{{ formatDate(item.date_added) }}</div>
      </template>
    </v-data-table>
  </v-card>

  <!-- Image Dialog -->
  <v-dialog v-model="imageDialog" max-width="500px">
    <v-card style="padding: 10px">
      <!-- <v-card-title class="text-h5">Advert Image</v-card-title> -->
      <v-card-text>
        <img :src="dialogImage" height="350px" width="100%" />
      </v-card-text>
      <v-card-actions>
        <v-btn text @click="imageDialog = false">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import advertWrapper from "@/components/advertWrapper.vue";
import axios from "axios";
import { onMounted, ref } from "vue";
import { useToast } from "vue-toastification";
import Swal from "sweetalert2";

const loading = ref(true);
const toast = useToast();

const search = ref("");
const items = ref([]);
const imageDialog = ref(false);
const dialogImage = ref("");

// Date format function (day/month/year)
const formatDate = (date) => {
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0"); // Month is 0-indexed
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
};

const headers = ref([
  { text: "Image", value: "image" },
  { text: "Description", value: "description" },
  { text: "Added By", value: "added_by" },
  { text: "Date Added", value: "date_added" },
  { text: "Actions", value: "actions" },
]);

// Fetch data function with error handling
const fetchData = async () => {
  try {
    const response = await axios.get("http://localhost:5000/adverts");
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

// Delete advert with confirmation
const deleteAdvert = async (advert_id) => {
  try {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You want to delete this advert!",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: '<span style="color: white">Yes, delete it!</span>',
      cancelButtonText: '<span style="color: white">Cancel</span>',
    });

    if (result.isConfirmed) {
      await axios.delete(`http://localhost:5000/adverts/${advert_id}`);
      toast.success("Deleted successfully");
      fetchData(); // Refresh the data after deletion
    }
  } catch (err) {
    console.error(err);
    toast.error("Error deleting advert");
  }
};

// Open image dialog on click
const openImageDialog = (image) => {
  dialogImage.value = `http://localhost:5000/imgs/${image}`;
  imageDialog.value = true;
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
