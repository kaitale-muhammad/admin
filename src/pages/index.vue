<template>
  <div>
    <h2>Upload Image</h2>
    <form enctype="multipart/form-data" @submit.prevent="onSubmit">
      <input type="file" ref="file" @change="onFileChange" />
      <button>Upload</button>
    </form>

    {{ message }}
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      file: "",
      message: "",
    };
  },

  methods: {
    onFileChange() {
      const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
      const file = this.$refs.file.files[0]; /// e.target.files[0];
      this.file = file;
      if (!allowedTypes.includes(file.type)) {
        this.message = "File Type is wrong";
      }
      if (file.size === 1000000) {
        this.message = "Too large file";
      }
    },

    async onSubmit() {
      const formData = new FormData();
      formData.append("file", this.file);

      try {
        await axios.post("http://localhost:5000/uploads", formData);
        this.message = "Uploaded Successsfully";
      } catch (err) {
        this.message = err.response.data.error;
      }
    },
  },
};

// const message = ref(null);

// const file = ref(null);
</script>
