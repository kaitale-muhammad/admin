<template>
  <div class="chart">
    <VCard class="mx-1">
      <VCardTitle class="text-h6">Summary</VCardTitle>
      <VCardText>
        <canvas ref="chartCanvas"></canvas>
      </VCardText>
    </VCard>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import Chart from "chart.js/auto";

const chartCanvas = ref(null);
const data = ref({
  labels: [],
  values: [],
});

onMounted(async () => {
  try {
    const response = await axios.get("http://localhost:5000/sarmmery");
    console.log("API Response:", response.data); // Debugging line

    // Assuming response.data is [{ services: 6, tips: 2, events: 2, news: 2, adverts: 3 }]
    const responseData = response.data[0]; // Extract the object inside the array
    data.value.labels = Object.keys(responseData);
    data.value.values = Object.values(responseData);

    if (chartCanvas.value) {
      const ctx = chartCanvas.value.getContext("2d");
      new Chart(ctx, {
        type: "bar",
        data: {
          labels: data.value.labels,
          datasets: [
            {
              label: "Total Particulars",
              data: data.value.values,
              backgroundColor: [
                "#42A5F5", // Blue
                "#66BB6A", // Green
                "#FFA726", // Orange
                "#FF7043", // Red
                "#AB47BC", // Purple
              ],
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: "Total",
              },
            },
            x: {
              title: {
                display: true,
                text: "Particulars",
              },
            },
          },
          plugins: {
            legend: {
              display: true,
              position: "top",
            },
            tooltip: {
              enabled: true,
            },
          },
        },
      });
    } else {
      console.error("chartCanvas ref is not defined.");
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
});
</script>

<style scoped>
canvas {
  max-width: 100%;
}
.chart {
  width: 99%;
}
.mx-1 {
  width: 99%;
  height: 60%;
}
</style>
