<template>
  <div class="user-settings">
    <v-expand-transition>
      <v-card v-show="expand" width="250" class="pa-5">
        <v-list>
          <v-list-subheader>Opciones</v-list-subheader>

          <v-list-item>
            <template v-slot:prepend>
              <v-icon icon="mdi-exit-to-app"></v-icon>
            </template>
            <v-list-item-title>
              <div @click="signOut" v-text="'Cerrar sesión'"></div>
            </v-list-item-title>
          </v-list-item>
          <v-list-item>
            <template v-slot:prepend>
              <v-icon icon="mdi-key-change"></v-icon>
            </template>
            <v-list-item-title>
              <p
                @click="$router.push('change-password')"
                style="white-space: normal"
                v-text="'Nueva contraseña'"
              ></p>
            </v-list-item-title>
          </v-list-item>
          <v-list-item>
            <v-list-item-title>
              <v-switch v-model="darkTheme"  color="primary" @change="toggleTheme">
              <template v-slot:label>
                <div class="d-flex flex-column">
                  <span class="d-block text-body">Cambiar Tema</span>
                  <span :class="'d-block text-caption '+ (darkTheme ? 'text-primary' : 'text-warning')">{{darkTheme ? 'Claro' : 'Oscuro'}}</span>
                </div>

              </template>
              </v-switch>


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
