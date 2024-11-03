<template>
  <div class="main">
    <div class="box">
      <v-dialog transition="dialog-top-transition" width="400" pa-4>
        <template v-slot:activator="{ props: activatorProps }">
          <v-btn
            v-bind="activatorProps"
            prepend-icon="mdi-plus"
            color="green"
            text="add Control Room"
          ></v-btn>
        </template>

        <template v-slot:default="{ isActive }">
          <v-card align-center>
            <v-toolbar title="Add Control Room"></v-toolbar>

            <v-form @submit.prevent="submitForm" class="pa-4 form">
              <input
                type="text"
                v-model="form.name"
                placeholder="Name"
                name="by"
                id="by"
              /><br />
              <input
                type="text"
                v-model="form.contact"
                placeholder="Contact"
                name="by"
                id="by"
              /><br />

              <v-btn
                class="mt-2"
                type="submit"
                color="primary"
                @click="isActive.value = false"
                block
                >Add</v-btn
              >
            </v-form>

            <v-card-actions class="justify-end">
              <v-btn
                class="text-white text-none rounded-md"
                color="red"
                rounded="0"
                variant="flat"
                @click="isActive.value = false"
              >
                Close
              </v-btn>
            </v-card-actions>
          </v-card>
        </template>
      </v-dialog>
    </div>
    <hr />

    <!-- <slot /> -->
    <!-- {{ service_name }}
                {{ image }}
                {{ description }} -->
  </div>
  <!-- <div v-for="data in data" :key="data.id">
                {{ data.service_name }}
              </div> -->
</template>

<style scoped>
.box {
  padding: 10px;
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: end;
}

input {
  width: 100%;
  padding: 10px;
  border: 1px solid blue;
  border-radius: 5px;
  outline: 1px solid blue;
  margin-bottom: 10px;
}

textarea {
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
</style>

<script setup>
import axios from "axios";
import { ref, reactive, onMounted, defineProps } from "vue";
import { useRouter } from "vue-router";
import { useToast } from "vue-toastification";
// const loading = ref(true);
// let data = ref(undefined);
const loading = ref(false);
const router = useRouter();
const toast = useToast();

const editing = false;

const form = reactive({
  name: "",
  contact: "",
});

// control_id, name, contact

const submitForm = async () => {
  loading.value = true;
  try {
    await axios.post(`http://localhost:5000/controls`, form);
    loading.value = false;
    toast.success("News added successfully!");
    // isActive.value = false;
  } catch (error) {
    loading.value = false;
    console.error(error);
    toast.error("Failed to add the news");
  }
};
</script>
