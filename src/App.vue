<template>
  <v-layout>
    <v-navigation-drawer v-model="drawer" class="bg-blue" theme="dark">
      <v-list-item
        v-for="item in items"
        :key="item"
        class="ma-2"
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
          prepend-icon="mdi-cog-outline"
          title="Settings"
        />
      </template>
    </v-navigation-drawer>

    <v-app-bar border="b" class="ps-4" flat>
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
                title="Settings"
              />

              <v-list-item append-icon="mdi-logout" link title="Logout" />
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

const getPath = () => {
  const pathname = path.name;
  if (pathname == "/") return "Dashboard";
  console.log(pathname?.split("/"));

  var name = pathname?.split("/")[1];
  return name?.substring(0, 1).toUpperCase() + name?.substring(1, name.length);
};

const drawer = ref(true);

const items = ref([
  {
    title: "Dashboard",
    prependIcon: "mdi-view-dashboard-outline",
    link: "/",
  },
  {
    title: "Team",
    prependIcon: "mdi-account-group",
    link: "/Team",
  },
  {
    title: "Services",
    prependIcon: "mdi-briefcase-outline",
    link: "/services",
  },
  {
    title: "Calendar",
    prependIcon: "mdi-calendar",
    link: "/contactd",
  },
  {
    title: "contact",
    prependIcon: "mdi-file-chart-outline",
    link: "/contact",
  },
]);
</script>
