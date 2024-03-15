// Utilities
import { defineStore } from "pinia";

export const useFilterTableStore = defineStore("filterTable", {
  state: () => ({
    toggleDrawer: false,
    filtersList: [],
    filterCleanList: [],
    furtherFilterKey: 0
  }),
  getters: {
    activeFilter: (state) => {
      return state.filterCleanList.length == 0 ? false : true;
    },
  },
  actions: {
    show() {
      this.toggleDrawer = true;
    },
    close() {
      this.toggleDrawer = false;
    },
    setFilterList(item) {
      this.filtersList = item;
    },
    async filter() {
      this.furtherFilterKey += 1;
      this.filterCleanList = this.filtersList
        .filter((item) => item.value && item.value.length > 0)
        .map((item) => ({ key: item.key, value: item.value }));
    },
    clean() {
      this.furtherFilterKey += 1;
      this.filterCleanList = [];
      this.filtersList.forEach((item) => (item.value = null));
    },
  },
});
