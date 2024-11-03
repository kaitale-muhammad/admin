<template>
  <TipsWrapper />
  <v-card flat>
    <v-card-title class="d-flex align-center pe-2">
      <v-icon icon="mdi-information-outline"></v-icon> &nbsp;&nbsp;&nbsp; FIND
      TIPS&nbsp;&nbsp;&nbsp;&nbsp;

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
    >
      <!-- tips_id, image, title, description, added_by, date_added -->
      <template #header.image>
        <div class="text-start">Image</div>
      </template>
      <template #header.title>
        <div class="text-start">Title</div>
      </template>

      <template #header.description>
        <div class="text-start">Description</div>
      </template>
      <!-- <template v-slot="header">
          {{ header.descripton }}
        </template> -->

      <template #header.added_by>
        <div class="text-start">Added By</div>
      </template>
      <template #header.date_added>
        <div class="text-start">Date Added</div>
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
        <v-card class="my-2" elevation="2" rounded>
          <img
            :src="`http://localhost:5000/imgs/${item.image}`"
            width="80"
            height="80"
          />
        </v-card>
      </template>
    </v-data-table>
  </v-card>
</template>

<script setup>
import TipsWrapper from "@/components/tipsWrapper.vue";
import axios from "axios";
import { onMounted, ref, defineProps } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useToast } from "vue-toastification";

const loading = ref(true);

const toast = useToast();
const route = useRoute();
const tips_id = route.params.id;

const search = ref("");
const items = ref([]);
//news_id, image, title, description, added_by, date_added
const headers = ref([
  { text: "Image", value: "image" },
  { text: "Title", value: "title" },
  { text: "Description", value: "description" },
  { text: "Added By", value: "added_by" },
  { text: "Date Added", value: "date_added" },

  { text: "Actions", value: "actions" },
]);

const fetchData = async () => {
  try {
    const response = await axios.get("http://localhost:5000/tips");
    items.value = response.data;
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};

// Fetch data when the component mounts
onMounted(fetchData);

const deleteTip = async (tips_id) => {
  try {
    const confirm = window.confirm("Are you sure you want to delete");
    if (confirm) {
      await axios.delete(`http://localhost:5000/tips/${tips_id}`).then(() => {
        console.log("deleted successfully");
        fetchData();
        toast.success("Deleted successfully");
      });
    }
  } catch (err) {
    console.log(err);
  }
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
