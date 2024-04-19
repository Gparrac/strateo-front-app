// Utilities
import { defineStore } from "pinia";

export const useFormDataStore = defineStore("formData", {
  state: () => ({
    formData:JSON.parse(localStorage.getItem("formData")),
    changeKey:0
  }),
  getters: {
    activeBackup: (state) => {
      return state.formData ? true : false;
    },
  },
  actions: {
    cleanDate() {
      this.formData = null;
      this.persistState();
    },
    persistState() {
      localStorage.setItem("formData", JSON.stringify(this.formData));
    },

  },

});
