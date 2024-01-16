<template>
  <div class="user-settings">
    <v-expand-transition>
      <v-card v-show="expand" width="250" class="pa-5">
        <v-list>
          <v-list-subheader>Opciones</v-list-subheader>

          <v-list-item @click="signOut" color="primary">
            <template v-slot:prepend>
              <v-icon icon="mdi-exit-to-app"></v-icon>
            </template>
            <v-list-item-title>
              <div  v-text="'Cerrar sesión'"></div>
            </v-list-item-title>
          </v-list-item>
          <v-list-item @click="$router.push('change-password')">
            <template v-slot:prepend>
              <v-icon icon="mdi-key-change"></v-icon>
            </template>
            <v-list-item-title>
              <p
                style="white-space: normal"
                v-text="'Nueva contraseña'"
              ></p>
            </v-list-item-title>
          </v-list-item>
          <v-list-item @click="toggleTheme" color="primary">
            <template v-slot:prepend>
              <v-icon :icon="darkTheme ? 'mdi-lightbulb-on' : 'mdi-lightbulb-outline'"></v-icon>
            </template>
            <v-list-item-title>
              <div class="d-flex flex-column">
                  <span class="d-block text-body text-dark">Cambiar Tema</span>
                  <span :class="'d-block text-caption '+ (darkTheme ? 'text-primary' : 'text-warning')">{{!darkTheme ? 'Claro' : 'Oscuro'}}</span>
                </div>
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-card>
    </v-expand-transition>
  </div>
</template>
<script>
import AuthUser from "@/services/auth/AuthUser.js";
const authUser = new AuthUser();
import { useTheme } from 'vuetify'

export default {
  name: "ModalUserSettings",
  props: {
    expand: Boolean,
  },
  data:function(){
    return{
      theme: useTheme(),
      darkTheme:false
    }
  },
  methods: {
    async signOut() {
      await authUser.logout();
      localStorage.clear();
      this.$router.push("sign-in");
    },
    toggleTheme() {
      this.theme.global.name = this.theme.global.current.dark ? 'light' : 'dark'
      this.darkTheme = !this.darkTheme;
    }
  },
  onMounted(){
    this.theme.global.name = localStorage.getItem('theme') || 'light';
    this.darkTheme = this.theme.global.current.dark;
  },
  unmounted(){
    localStorage.setItem("theme", this.theme.global.name);
  }
};
</script>
<style scoped>
.user-settings {
  position: absolute;
  right: 0;
  z-index: 10000000;
}
</style>
