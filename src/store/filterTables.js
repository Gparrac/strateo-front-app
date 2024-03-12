// Utilities
import { defineStore } from "pinia";

export const useFilterTableStore = defineStore("filterTable", {
  state: () => ({
    toggleDrawer: false,
    filtersList: [],
    filterCleanList: []
  }),
  actions: {
    show() {
      this.toggleDrawer = true;
    },
    close(){
      this.toggleDrawer = false;
    },
    setFilterList(item){
      console.log('passing',item)
      this.filtersList = item;
    },
    filter(){
      this.filterCleanList = this.filtersList.filter(item  => item.value && item.value.length > 0).map(item => ({key:item.key, value: item.value}))
    }
  },
});
