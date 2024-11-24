<template>
  <div class="dashboard">
    <v-container>
      <v-row>
        <!-- Clients Vs Users Chart -->
        <v-col cols="12" md="6" lg="4">
          <v-card class="mx-1">
            <v-card-title class="text-h6">Clients Vs Users</v-card-title>
            <hr />
            <v-card-text>
              <canvas ref="chartCanvas4"></canvas>
            </v-card-text>
          </v-card>
        </v-col>

        <!-- Total Application Users & Other Stats -->
        <v-col cols="12" md="6" lg="4">
          <v-card class="mx-1" id="vs">
            <v-card-title class="text-h6">
              <div style="display: flex; justify-content: space-between">
                Total Application Users
                <v-icon class="text-primary">mdi-account-group</v-icon>
              </div>
            </v-card-title>
            <hr />
            <v-card-text>
              <h1 class="text-primary">{{ totalusers }}</h1>
            </v-card-text>
          </v-card>
          <v-card class="mx-1" id="vs">
            <v-card-title class="text-h6">
              <div style="display: flex; justify-content: space-between">
                Total Workers
                <v-icon class="text-primary"
                  >mdi-account-hard-hat-outline</v-icon
                >
              </div>
            </v-card-title>
            <hr />
            <v-card-text>
              <h2 class="text-primary">{{ totalworkers }}</h2>
            </v-card-text>
          </v-card>
          <v-card class="mx-1" id="vs">
            <v-card-title class="text-h6">
              <div style="display: flex; justify-content: space-between">
                Total Clients
                <v-icon class="text-primary">mdi-handshake-outline</v-icon>
              </div>
            </v-card-title>
            <hr />
            <v-card-text>
              <h2 class="text-primary">{{ totalclients }}</h2>
            </v-card-text>
          </v-card>
        </v-col>

        <!-- Workers Vs Users Chart -->
        <v-col cols="12" md="6" lg="4">
          <v-card class="mx-1" id="vs">
            <v-card-title class="text-h6">Workers Vs Users</v-card-title>
            <hr />
            <v-card-text>
              <canvas ref="chartCanvas3"></canvas>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <div class="dashboard2">
      <v-container>
        <v-row>
          <!-- Clients Vs Users Chart -->
          <v-col cols="12" md="6" lg="6">
            <div class="chart">
              <VCard class="mx-1">
                <VCardTitle class="text-h6">Categories</VCardTitle>
                <hr />
                <VCardText>
                  <canvas ref="chartCanvas"></canvas>
                </VCardText>
              </VCard>
            </div>
          </v-col>

          <!-- Clients Vs Users Chart -->
          <v-col cols="12" md="6" lg="6">
            <div class="chart">
              <VCard class="mx-1">
                <VCardTitle class="text-h6">Categories</VCardTitle>
                <hr />
                <VCardText>
                  <canvas ref="chartCanvas2"></canvas>
                </VCardText>
              </VCard>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import api from "@/axios";
import Chart from "chart.js/auto";

const totalusers = ref("");
const totalclients = ref("");
const totalworkers = ref("");

const chartCanvas4 = ref(null);
const data4 = ref({
  labels: [],
  values: [],
});

const chartCanvas = ref(null);
const data = ref({
  labels: [],
  values: [],
});
const chartCanvas2 = ref(null);
const data2 = ref({
  labels: [],
  values: [],
});

const chartCanvas3 = ref(null);
const data3 = ref({
  labels: [],
  values: [],
});

onMounted(async () => {
  // total app users

  try {
    const response = await api.get("/appusers");

    const responseData = response.data[0].users;
    totalusers.value = responseData;
  } catch (err) {
    console.log(err);
  }
  // Total clients
  try {
    const response = await api.get("/sumclients");

    const responseData = response.data[0].clients;
    totalclients.value = responseData;
  } catch (err) {
    console.log(err);
  }

  // Total workers
  try {
    const response = await api.get("/sumworkers");

    const responseData = response.data[0].workers;
    totalworkers.value = responseData;
  } catch (err) {
    console.log(err);
  }
  // workes VS users

  try {
    const response = await api.get("/users_workers");

    const responseData = response.data[0];
    data3.value.labels = Object.keys(responseData);
    data3.value.values = Object.values(responseData);

    if (chartCanvas3.value) {
      const ctx = chartCanvas3.value.getContext("2d");
      new Chart(ctx, {
        type: "pie",
        data: {
          labels: data3.value.labels,
          datasets: [
            {
              label: "Workers Vs Users",
              data: data3.value.values,
              backgroundColor: [
                "#66BB6A", // Green
                "#FFA726", // Orange
              ],
              hoverOffset: 10,
            },
          ],
        },
      });
    } else {
      console.error("chartCanvas ref is not defined.");
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }

  // Clients VS users

  try {
    const response = await api.get("/users_clients");

    const responseData = response.data[0];
    data4.value.labels = Object.keys(responseData);
    data4.value.values = Object.values(responseData);

    if (chartCanvas4.value) {
      const ctx = chartCanvas4.value.getContext("2d");
      new Chart(ctx, {
        type: "pie",
        data: {
          labels: data4.value.labels,
          datasets: [
            {
              label: "Clients Vs Users",
              data: data4.value.values,
              backgroundColor: [
                "#42A5F5", // Blue
                "#AB47BC", // Purple
              ],

              hoverOffset: 10,
            },
          ],
        },
      });
    } else {
      console.error("chartCanvas ref is not defined.");
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }

  /// bar
  try {
    const response = await api.get("/sarmmery");

    const responseData = response.data[0];
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
                "#FF22AD", //
                "#67B5A1", //
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

  ////////
  try {
    const response = await api.get("/sarmmery");

    const responseData = response.data[0];
    data2.value.labels = Object.keys(responseData);
    data2.value.values = Object.values(responseData);

    if (chartCanvas2.value) {
      const ctx = chartCanvas2.value.getContext("2d");
      new Chart(ctx, {
        type: "doughnut", //doughnut
        data: {
          labels: data.value.labels,
          datasets: [
            {
              label: "Total Particulars",
              data: data2.value.values,
              backgroundColor: [
                "#42A5F5", // Blue
                "#66BB6A", // Green
                "#FFA726", // Orange
                "#FF7043", // Red
                "#AB47BC", // Purple
                "#FF22AD", //
                "#67B5A1", //
              ],

              hoverOffset: 100,
            },
          ],
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
.dashboard {
  background-color: ghostwhite;
}
.dashboard1 {
  display: flex;
  margin-bottom: 10px;
  margin-left: 5px;
  margin-top: 5px;
}
.dashboard2 {
  margin-top: -20px;
  display: flex;
  margin-bottom: 10px;
  margin-left: 5px;
}

#vs {
  margin-bottom: 15px;
}
canvas {
  max-width: 100%;
}
.chart {
  width: 99%;
}
.mx-1 {
  /* width: 99%; */
  /* height: 60%; */
}
</style>
