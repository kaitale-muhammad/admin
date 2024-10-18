<template>
  <homeWraper :fetch="fetch" :data="data" />
  <v-table height="550px">
    <thead>
      <tr style="color: white; background-color: black">
        <th class="text-left">Service Name</th>
        <th class="text-left">Image</th>
        <th class="text-left">Description</th>
        <th class="text-left">status</th>
        <th class="text-left">Operations</th>
      </tr>
    </thead>

    <tbody>
      <p v-if="loading">loading...</p>
      <template v-if="data">
        <tr v-for="item in data" :key="item.id">
          <td>{{ item.service_name }}</td>
          <td>{{ item.image }}</td>
          <td>{{ item.descripton }}</td>
          <td>{{ item.status }}</td>
          <td>
            <v-icon
              icon="mdi-delete"
              pa="7"
              @click="deleteUser(item.id)"
            ></v-icon>

            <router-link :to="`/${item.id}`">
              <v-icon icon="mdi-pencil" pa="7" @click="getEditPath"> </v-icon>
            </router-link>
          </td>
        </tr>
      </template>
    </tbody>
  </v-table>
</template>

<script setup>
import homeWraper from "@/components/homeWraper.vue";
import router from "@/router";

import axios from "axios";
import { onMounted, ref, defineProps } from "vue";
import { useRoute, useRouter } from "vue-router";
const loading = ref(true);
let data = ref(undefined);

const route = useRoute();
const id = route.params.id;

const fetch = async () => {
  try {
    const response = await axios.get("http://localhost:5000/services");
    data.value = response.data;
    loading.value = false;
    //console.log(response.data);
  } catch (error) {
    loading.value = false;
    console.log(error);
  }
};
fetch();
onMounted(() => {
  fetch();
});
const deleteUser = async (id) => {
  try {
    const confirm = window.confirm("Are you sure you want to delete");
    if (confirm) {
      await axios.delete(`http://localhost:5000/services/${id}`).then(() => {
        console.log("deleted successfully");
        fetch();
      });
    }
  } catch (err) {
    console.log(err);
  }
};

const path = useRoute();

const getEditPath = () => {
  const pathname = path.name;
  if (pathname == `/editservice/${id}`) {
    router.push("/editservice");

    console.log(pathname?.split("/"));
  }
};
</script>
