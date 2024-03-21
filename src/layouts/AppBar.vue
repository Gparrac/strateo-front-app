<template>
  <v-app>
    <v-layout class="">
      <v-app-bar>
        <v-app-bar-title
          ><span @click="$router.push('/')">STRATEO</span></v-app-bar-title
        >

        <template v-slot:prepend>
          <v-app-bar-nav-icon
            variant="text"
            @click.stop="drawer = !drawer"
          ></v-app-bar-nav-icon>
        </template>

        <v-spacer></v-spacer>
        <div class="d-flex flex-column">
          <span class="d-block text-subtitle-1 text-right">{{
            userAuthStore.user?.name
          }}</span>
          <span
            class="d-block text-subtitle-2 text-grey-lighten-1 text-right"
            >{{ userAuthStore.user?.email }}</span
          >
        </div>
        <v-btn icon @click="() => (toggleSettings = !toggleSettings)">
          <v-icon>mdi-account-circle</v-icon>
        </v-btn>
      </v-app-bar>

      <v-main
        class="d-flex align-start justify-center"
        style="min-height: 100vh"
      >
        <alert-message></alert-message>
        <ModalUserSettings :expand="toggleSettings"></ModalUserSettings>
        <div class="w-100 pa-16">
          <router-view />
        </div>
      </v-main>
      <v-navigation-drawer
        class="pl-1"
        v-model="drawer"
        location="left"
        temporary
        width="300"
      >
        <v-list v-model:opened="openSections">
          <v-list-item
            prepend-icon="mdi-home"
            title="Home"
            to="/"
          ></v-list-item>
          <v-list-group
            v-for="(section, i) in sections"
            :key="`${i}-s-${i.id}`"
            :value="i + 's'"
          >
            <template v-slot:activator="{ props }">
              <v-list-item
                v-bind="props"
                :prepend-icon="section.icon"
                :title="section.name"
              ></v-list-item>
            </template>
            <v-list :items="section.forms">
              <v-list-item
                v-for="(form, i) in section.forms"
                :key="i"
                :value="form"
                color="primary"
                class="ml-7"
                :to="form.href"
              >
                <template v-slot:prepend>
                  <v-icon :icon="form.icon"></v-icon>
                </template>

                <v-list-item-title>
                  <div v-text="form.name" class="text-wrap"></div>
                </v-list-item-title>
              </v-list-item>
            </v-list>
          </v-list-group>
        </v-list>
        <p class="pa-7" v-if="sections.length === 0">
          <!-- Contenido para cuando no hay elementos -->
          No hay secciones disponibles...
        </p>
      </v-navigation-drawer>
      <v-navigation-drawer
        v-model="filterTableStore.toggleDrawer"
        location="right"
        temporary
      >
        <filter-field-card></filter-field-card>
      </v-navigation-drawer>
    </v-layout>
  </v-app>
</template>
<script>
import AlertMessage from "@/components/blocks/AlertMessage.vue";
import ModalUserSettings from "@/components/blocks/ModalUserSettings.vue";
import FormApi from "@/services/Forms/FormApi";
import { useFilterTableStore } from "@/store/filterTables";
import { useUserAuthStore } from "@/store/userAuth";
import FilterFieldCard from "@/components/blocks/FilterFieldCard.vue";
import { mapStores } from "pinia";

const formApi = new FormApi();

export default {
  name: "AppBar",
  components: {
    ModalUserSettings,
    AlertMessage,
    FilterFieldCard,
  },
  data: () => ({
    toggleSettings: false,
    drawer: false,
    sections: [],
    openSections: [],
  }),
  async mounted() {
    await this.getFormsAvailable();
  },
  computed: {
    ...mapStores(useUserAuthStore, useFilterTableStore),
  },
  methods: {
    async getFormsAvailable() {
      const response = await formApi.read("format=routes-available");
      if (response.statusResponse) {
        this.sections = response.data;
        this.openSections = ["0s"];
      }
    },
  },
};
</script>
