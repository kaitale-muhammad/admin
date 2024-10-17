<template>
  <div class="main">
    <div class="box">
      <v-dialog transition="dialog-top-transition" width="400" pa-4>
        <template v-slot:activator="{ props: activatorProps }">
          <v-btn
            v-bind="activatorProps"
            prepend-icon="mdi-plus"
            color="green"
            text="add Event"
          ></v-btn>
        </template>

        <template v-slot:default="{ isActive }">
          <v-card align-center>
            <v-toolbar title="Add a Service"></v-toolbar>

            <v-form
              enctype="multipart/form-data"
              @submit.prevent="saveUser"
              class="pa-4 form"
            >
              <input
                type="text"
                v-model="form.service_name"
                placeholder="Service Name"
                name="service_name"
                id="service_name"
              /><br />
              <input type="file" ref="file" @change="onFileChange" /><br />
              <input
                type="text"
                v-model="form.description"
                placeholder="Description"
                name="description"
                required
              /><br />
              <input
                type="text"
                v-model="form.status"
                name="status"
                id="statuss"
                placeholder="Status"
              /><br />

              <v-btn class="mt-2" type="submit" color="primary" block>{{
                editing ? "Update" : "Add"
              }}</v-btn>
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

<style>
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

.form {
  align-items: center;
  justify-content: center;
}
</style>

<script setup>
import axios from "axios";
import { ref, reactive, onMounted, defineProps } from "vue";
import { useRouter } from "vue-router";

// const loading = ref(true);
// let data = ref(undefined);

const router = useRouter();

const editing = false;

defineProps({
  fetch: Function,
  data: {
    type: Object,
    default: "Nothing",
  },
});

const form = reactive({
  service_name: "",
  file: "",
  description: "",
  status: "",
});

// const fetch = async () => {
//   try {
//     const response = await axios.get("http://localhost:5000/services");
//     data.value = response.data;
//     loading.value = false;
//     console.log(response.data);
//   } catch (error) {
//     loading.value = false;
//     console.log(error);
//   }
// };
// fetch();
// console.log(data);
onMounted(() => {
  fetch();
});

const saveUser = async () => {
  const formData = new FormData();
  formData.append("file", form);

  try {
    await axios
      .post("http://localhost:5000/addservices", form)
      .then((response) => {
        console.log(response);
        router.push("/services");
        //fetch();
      });
  } catch (err) {
    //fetch();
    console.log(err);
  }
};
//this.resetForm();

const onFileChange = () => {
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
  const image = this.$refs.file.files[0]; /// e.target.files[0];
  image = file;
  if (!allowedTypes.includes(file.type)) {
    this.message = "File Type is wrong";
  }
  if (file.size === 1000000) {
    this.message = "Too large file";
  }
};

const onSubmit = async () => {
  const formData = new FormData();
  formData.append("file", this.file);

  try {
    await axios.post("http://localhost:5000/uploads", formData);
    this.message = "Uploaded Successsfully";
  } catch (err) {
    this.message = err.response.data.error;
  }
};
</script>
