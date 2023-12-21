// Utilities
import { defineStore } from "pinia";

export const useAlertMessageStore = defineStore("alertMessage", {
  state: () => ({
    toggleAlert: false,
    message: "",
    kind: false,
  }),
  getters: {
    them: (state) => {
      return state.kind ? "info" : "warning";
    },
  },
  actions: {
    show(kind, message) {
      this.kind = kind;
      this.message = message;
      this.toggleAlert = true;
      setTimeout(() => {
        this.toggleAlert = false;
      }, 4000);
    },
  },
});
