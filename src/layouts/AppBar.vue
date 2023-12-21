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
            this.user?.name
          }}</span>
          <span
            class="d-block text-subtitle-2 text-grey-lighten-1 text-right"
            >{{ this.user?.email }}</span
          >
        </div>
        <v-btn icon @click="() => (toggleSettings = !toggleSettings)">
          <v-icon>mdi-account-circle</v-icon>
        </v-btn>
      </v-app-bar>

      <v-navigation-drawer
        class="pl-3"
        v-model="drawer"
        location="left"
        permanent
      >
        <template v-for="(section, i) in sections" :key="`${i}-s-${i.id}`">
          <v-list-subheader>{{ i + 1 + ". " + section.name }}</v-list-subheader>

          <v-list :items="section.forms">
            <v-list-item
              v-for="(form, i) in section.forms"
              :key="i"
              :value="form"
              color="primary"
              :to="form.href"
            >
              <template v-slot:prepend>
                <v-icon :icon="form.icon"></v-icon>
              </template>

              <v-list-item-title>
                <div v-text="form.name"></div>
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </template>
      </v-navigation-drawer>

      <v-main
        class="d-flex align-start justify-center"
        style="min-height: 100vh"
      >
        <alert-message></alert-message>
        <ModalUserSettings
          :email="user?.email"
          :expand="toggleSettings"
        ></ModalUserSettings>
        <div class="w-100 pa-16">
          <router-view />
        </div>
      </v-main>
    </v-layout>
  </v-app>
</template>
<script>
import AlertMessage from "@/components/blocks/AlertMessage.vue";
import AuthUser from "@/services/auth/AuthUser";
import ModalUserSettings from "@/components/blocks/ModalUserSettings.vue";
import FormApi from "@/services/Forms/FormApi";
const authUser = new AuthUser();
const formApi = new FormApi();

export default {
  name: "AppBar",
  components: {
    ModalUserSettings,
    AlertMessage,
  },
  data: () => ({
    user: {},
    toggleSettings: false,
    drawer: false,
    sections: [],
  }),
  async mounted() {
    await this.checkAuthUser();
    await this.getFormsAvailable();
    this.getUser();
  },
  methods: {
    async checkAuthUser() {
      const userData = await authUser.user();
      if (userData.statusResponse != 200) {
        this.$router.push("/sign-in");
      }
      this.user = userData;
    },
    async getFormsAvailable() {
      const response = await formApi.read("?format=routes-available");
      if (response.data) {
        this.sections = response.data;
      }
    },
    async getUser() {
      const savedUser = localStorage.getItem("user");
      this.user = JSON.parse(savedUser);
      if (savedUser) {
        // Actualizar el estado con los datos recuperados
      }
    },
  },
};
</script>
