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
                v-text="'Cambiar contraseña'"
              ></p>
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
export default {
  name: "ModalUserSettings",
  props: {
    expand: Boolean,
  },
  methods: {
    async signOut() {
      await authUser.logout();
      localStorage.clear();
      this.$router.push("sign-in");
    },
  },
};
</script>
<style scoped>
.user-settings {
  position: absolute;
  right: 0;
  z-index: 10000000;
}
</style>
