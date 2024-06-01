// Utilities
import { castFullDate, currentlyTime } from "@/utils/cast";
import { defineStore } from "pinia";

export const useAnalyticDateStore = defineStore("analyticDate", {
  state: () => ({
    startDate: currentlyTime(undefined, 10),
    endDate: currentlyTime(),
    keyUpdate: 0
  }),
  getters: {
    castStart: (state) => {
      return (kindDate = false) => castFullDate(kindDate ? state.startDate : state.endDate);
    },
  },
  actions: {
    saveDateRange() {
      this.keyUpdate += 1;
    },
  },
});
