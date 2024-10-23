<template>
  <div class="main">
    <VCard
      width="400px"
      class="card"
      align-center
      elevation="true"
      border="red">
      <VForm @submit.prevent="">
        {{ id }}
        <input type="text" v-model="form.service_name" />
        <input type="text" v-model="form.file" />
        <input type="text" v-model="form.description" />
        <input type="text" v-model="form.status" />

        <v-btn class="mt-2" type="submit" color="primary" block>Edit</v-btn>
      </VForm>
    </VCard>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";
import { useToast } from "vue-toastification";

const form = reactive({
  service_name: "",
  file: "",
  description: "",
  status: "",
});

const state = reactive({
  job: {},
  isLoading: true,
});

const route = useRoute();
const router = useRouter();
const id = route.params.id;

const toast = useToast();

// const name = ref("");
// name.value = "My name";
const jobs=ref([]);
onMounted(async () => {
 
  try {
    const response = await axios.get(`http://localhost:5000/services/` + id);

    jobs.value=response.data
    console.log(response.data);
    
    
    // if (response.data[0].id == id) {
    //   form.service_name = response.data[0].service_name;
    //   form.file = state.job.file;
    //   form.description = state.job.description;
    //   form.status = state.job.status;
    // }
   
  } catch (err) {
    console.log(err);
  }
});
</script>

<style scoped>
input {
  width: 100%;
  padding: 10px;
  border: 1px solid blue;
  border-radius: 5px;
  outline: 1px solid blue;
  margin-bottom: 10px;
}

.form {
  align-items: center;
  justify-content: center;
}

.main {
  justify-content: center;
  align-items: center;
  justify-items: center;
  display: flex;
  margin-top: 50px;
}
div .card {
  padding: 20px;
}
</style>
