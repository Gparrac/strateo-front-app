<template>
  <v-row class="pb-10">
    <v-col cols="12" md="6">
      <h1>Bienvenido a Strateo-app</h1>
      <h3>Rango de fechas para estudiar</h3>
    </v-col>
    <v-col cols="12" md="6" >
      <v-form ref="formDates">
      <v-row >
        <v-col cols="12" sm="6" md="6">
          <v-text-field
            type="date"
            variant="outlined"
            label="Fecha de inicio"
            :rules="startDateRule"
            v-model="analyticDateStore.startDate"
          ></v-text-field>
        </v-col>
        <v-col cols="12" sm="6" md="6" class="d-flex">
          <v-text-field
            type="date"
            variant="outlined"
            label="Fecha de finalización"
            :rules="endDateRule"
            v-model="analyticDateStore.endDate"
          ></v-text-field>
          <div>
            <v-btn
              @click="setDate"
              icon="mdi-reload"
              color="deep-purple-accent-4"
              class="ml-3"
              variant="tonal"
            >
            </v-btn>
          </div>
        </v-col>
      </v-row>
    </v-form>
    </v-col>
  </v-row>

  <HeaderListCard></HeaderListCard>
  <CustomerSection ></CustomerSection>
  <v-divider class="my-5" :thickness="3" color="info"></v-divider>
  <seller-section></seller-section>
  <v-divider class="my-5" :thickness="3" color="info"></v-divider>

</template>

<script>
import HeaderListCard from "@/components/analytics/HeaderListCard.vue";
import CustomerSection from "@/components/analytics/CustomerSection.vue";
import { useAnalyticDateStore } from "@/store/analyticDate";
import { RulesValidation } from "@/utils/validations";
import { mapStores } from "pinia";
import SellerSection from '@/components/analytics/SellerSection.vue';
export default {
  components: {
    HeaderListCard,
    CustomerSection,
    SellerSection
  },
  data: () => ({
    rulesValidation: RulesValidation,
  }),
  computed: {
    startDateRule() {
      let rules = [
        ...this.rulesValidation.date.rules,

        (value) =>
          this.endDate
            ? new Date(value) < new Date(this.analyticDateStore.endDate) ||
              "La fecha de inicio debe ser menor a la de finalización. "
            : true,
      ];
      return rules;
    },
    endDateRule() {
      return [
        ...this.rulesValidation.date.rules,
        (value) =>
          new Date(value) > new Date(this.analyticDateStore.startDate) ||
          "La fecha de finalización debe ser mayor a la de inicio. ",
      ];
    },
    ...mapStores(useAnalyticDateStore),
  },
  methods:{
    async setDate() {

    const { valid } = await this.$refs.formDates.validate();
      if (valid) {
        this.analyticDateStore.saveDateRange()
      }
  },
  },
  mounted() {
  },
};
</script>
