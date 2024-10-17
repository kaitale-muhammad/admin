<script setup>
import axios from "axios";

const fetch = async () => {
  try {
    const response = await axios.get("http://localhost:5000/users");
    console.log(response.data);
  } catch (error) {
    console.log(error);
  }
};
fetch();
</script>

<template>vbfbggbw</template>
