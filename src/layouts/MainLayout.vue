<template>
  <v-layout>
    <!-- Conditionally render the sidebar -->
    <v-navigation-drawer
      v-if="!$route.meta.hideSidebarAndAppBar"
      v-model="drawer"
      class="bg-blue"
      theme="dark"
    >
      <v-list-item
        style="color: white"
        v-for="item in items"
        :key="item"
        class="ma-1 white--text"
        link
        nav
        :prepend-icon="item.prependIcon"
        :title="item.title"
        :to="item.link"
      />

      <template #append>
        <v-list-item
          class="ma-2"
          link
          nav
          @click="logout"
          prepend-icon="mdi-logout"
          title="Logout"
          style="height: 10px"
        />
      </template>
    </v-navigation-drawer>

    <!-- Conditionally render the app bar -->
    <v-app-bar
      v-if="!$route.meta.hideSidebarAndAppBar"
      border="b"
      class="ps-4"
      flat
    >
      <v-app-bar-nav-icon
        v-if="$vuetify.display.smAndDown"
        @click="drawer = !drawer"
      />

      <v-app-bar-title>
        {{ getPath() }}
      </v-app-bar-title>

      <template #append>
        <v-btn class="text-none me-2" height="48" icon slim>
          <v-avatar color="info">
            <v-icon icon="mdi-account-circle"></v-icon>
          </v-avatar>

          <v-menu activator="parent">
            <v-list density="compact" nav>
              <v-list-item
                append-icon="mdi-cog-outline"
                link
                @click="settings"
                title="Settings"
              />
              <v-list-item
                style="height: 50px"
                @click="logout"
                append-icon="mdi-logout"
                link
                title="Logout"
              />
            </v-list>
          </v-menu>
        </v-btn>
      </template>
    </v-app-bar>

    <v-main>
      <router-view />
    </v-main>
  </v-layout>
</template>

<script setup>
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";

const path = useRoute();
const router = useRouter();

const getPath = () => {
  const pathname = path.name;
  if (pathname == "/") return "Dashboard";

  var name = pathname?.split("/")[1];
  return name?.substring(0, 1).toUpperCase() + name?.substring(1, name.length);
};

const logout = () => {
  localStorage.removeItem("user"); // Remove user data from local storage
  router.push("/login");
};

const settings = () => {
  router.push("/settings");
};
const drawer = ref(true);

const items = ref([
  {
    title: "Dashboard",
    prependIcon: "mdi-view-dashboard-outline",
    link: "/",
  },
  {
    title: "Services",
    prependIcon: "mdi-briefcase-outline",
    link: "/services",
  },
  {
    title: "Users",
    prependIcon: "mdi-account-group",
    link: "/users",
  },
  {
    title: "Workers",
    prependIcon: "mdi-account-hard-hat-outline",
    link: "/workers",
  },
  {
    title: "Clients",
    prependIcon: "mdi-handshake-outline",
    link: "/clients",
  },
  {
    title: "Notes Board",
    prependIcon: "mdi-note-outline",
    link: "/notesboard",
  },
  {
    title: "Events",
    prependIcon: "mdi-calendar",
    link: "/events",
  },
  {
    title: "News",
    prependIcon: "mdi-equal-box",
    link: "/news",
  },
  {
    title: "Tips",
    prependIcon: "mdi-information-outline",
    link: "/tips",
  },
  {
    title: "Attendance",
    prependIcon: "mdi-checkbox-marked-outline",
    link: "/attendance",
  },
  {
    title: "Control Rooms",
    prependIcon: "mdi-phone",
    link: "/controls",
  },
  {
    title: "Adverts",
    prependIcon: "mdi-speaker-wireless",
    link: "/adverts",
  },
]);
</script>

<style scoped>
#mainapp {
  margin: 0;
  padding: 0;
  overflow: hidden;
  overflow-y: hidden;
}
* {
  margin: 0;
  overflow: hidden;
}
</style>
