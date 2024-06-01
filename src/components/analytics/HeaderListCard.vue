<template>
  <v-row class="justify-center g-5">
    <v-col cols="12" sm="6" md="4" class="px-4" v-for="(card, i) in cards" :key="`${i}-card`">
      <header-card class="" :icon="card.icon" :title="card.title" :value="card.value"></header-card>
    </v-col>
  </v-row>
</template>
<script>
import HeaderCard from "@/components/analytics/HeaderCard.vue";
import AnalyticApi from "@/services/Forms/AnalyticApi";
import { useAnalyticDateStore } from '@/store/analyticDate';
import { mapActions, mapStores } from "pinia";

const analyticApi = new AnalyticApi();
export default {
  components:{
    HeaderCard,
  },
  data: () => ({
    cards:[{title: 'Clientes totales', icon:'mdi-account-group-outline', value:0}, {title: 'Empleados activos', icon:'mdi-account-group', value:0}, {title: 'Eventos realizados', icon:'mdi-map', value:0}],
    keySuscribeUpdate:0
  }),
  methods:{
    ...mapActions(useAnalyticDateStore, ["$subscribe"]),
    async setTotalClient() {
      const castStartDate = this.analyticDateStore.castStart(true);
      const castEndDate = this.analyticDateStore.castStart(false);
      const query =`option=TA&end_date=${castEndDate}&start_date=${castStartDate}`;
      const rtaCustomer = (await analyticApi.read('/client',query)).data;
      const rtaSeller = (await analyticApi.read('/seller',query)).data;
      const rtaInvoice = (await analyticApi.read('/invoice',query)).data;
      this.cards[0].value = rtaCustomer;
      this.cards[1].value = rtaSeller;
      this.cards[2].value = rtaInvoice;
    },
  },
  computed:{
    ...mapStores(useAnalyticDateStore),
  },
  async mounted(){
    try {
      this.$subscribe(async (mutation, state) => {
        if (
          mutation.storeId == "analyticDate" &&
          state.keyUpdate != this.keySuscribeUpdate
        ) {
          this.keySuscribeUpdate = state.keyUpdate;
          await Promise.all([
            this.setTotalClient(),
          ]);
        }
      });
      await this.setTotalClient();
    } catch (error) {
      console.error(error);
    }
  },


}
</script>
