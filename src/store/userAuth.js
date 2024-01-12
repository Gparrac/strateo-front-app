// Utilities
import { defineStore } from "pinia";

export const useUserAuthStore = defineStore("userAuth", {
  state: () => ({
    user:JSON.parse(localStorage.getItem("user")),
    authToken: localStorage.getItem('auth-token'),
  }),
  getters: {
    them: (state) => {
      return state.kind ? "info" : "warning";
    },
  },
  actions: {
    saveCredentials(data) {
      this.user = data.user;

      this.authToken = data.access_token;
      this.persistState();
    },
    persistState() {

      // Guarda el estado actual en el localStorage
      localStorage.setItem("auth-token", this.authToken);
      localStorage.setItem("user", JSON.stringify(this.user));
    },

    loadState() {
     // Lee el estado del localStorage al iniciar la aplicación
      const authToken = localStorage.getItem("auth-token");
      const user = localStorage.getItem("user");
      if (authToken && user) {
        this.authToken = authToken;
        this.user = JSON.parse(user);
      }
    },
  },

});
