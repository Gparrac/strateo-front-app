// Utilities
import { defineStore } from "pinia";

export const useCheckInvoiceStep = defineStore("checkInvoiceStep", {
  state: () => ({
    check:false,


  }),
  actions: {
    handleUpdateInvoiceData(callback){
      this.check = true;
      console.log('passing!' , this.check)
      if (callback && typeof callback === "function")
      callback();
    }


  },

});
