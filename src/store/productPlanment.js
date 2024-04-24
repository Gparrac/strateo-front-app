// Utilities
import { defineStore } from "pinia";

export const useProductPlanmentStore = defineStore("productPlanment", {
  state: () => ({
    productEvents:[],
    subproducts:[],
    changeKey:0
  }),
  getters: {
    productEventsAllowed: (state) => {
      return state.productEvents.map((item)=> ({
        id: item.id,
        name:item.name,
        amount: 0
      }));
    },
  },
  actions: {
    addEvent(item){
      const index = this.productEvents.findIndex(function (objeto) {
        return objeto.id === item.id;
      });
      if (index === -1) {
        this.productEvents.push(item);

      }
      if(item.subproducts && item.subproducts.length > 0){
        item.subproducts.forEach(sub => {
          const index = this.subproducts.findIndex(function (item) {
            return item.id === sub.id;
          });
          const event = {
                id:item.id,
                name: item.name,
                amount: sub.amount
              };
          if (index === -1){
            sub.events = [event];
              this.subproducts.push(sub);
          }else{
            (this.subproducts[index].events) ?
            this.subproducts[index].events.push(event)
            : this.subproducts[index].events = [event];
          }
        });
      }
    },
    deleteEvent(item){
      this.productEvents = this.productEvents.filter((productEvents) => productEvents.id != item.id)
      this.subproducts.forEach((subproduct) => {
        const index = subproduct.events.findIndex(function(event){
          return item.id == event.id;
        });
        if(index !== -1){
          subproduct.events.splice(index,1);
        }
      });
    },


  },

});
