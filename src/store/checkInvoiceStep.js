// Utilities
import { defineStore } from "pinia";

export const useCheckInvoiceStep = defineStore("checkInvoiceStep", {
  state: () => ({
    check:false,


  }),
  actions: {
    handleUpdateInvoiceData(callback){
      this.check = true;
      if (callback && typeof callback === "function")
      callback();
    }


  },

});
