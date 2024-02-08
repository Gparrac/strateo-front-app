// Utilities
import { errorHandler } from "@/utils/cast";
import { defineStore } from "pinia";

export const useAlertMessageStore = defineStore("alertMessage", {
  state: () => ({
    toggleAlert: false,
    message: "",
    kind: false,
    listErrors: []
  }),
  getters: {
    them: (state) => {
      return state.kind ? "info" : "warning";
    },
  },
  actions: {
    show(kind, message, errors = null) {
      if(errors) this.listErrors = errorHandler(errors);
      this.kind = kind;
      this.message = message;
      this.toggleAlert = true;
      setTimeout(() => {
        this.toggleAlert = false;
        this.listErrors = [];
      }, this.listErrors.length != 0 ? 7000 : 4000);
    },
  },
});
