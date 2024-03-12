<template>
  <v-card rounded="true" elevation="0">
    <v-card-text>
      <!-- Business Name or normal name -->
      <v-row>
        <v-col cols="12" sm="6" lg="3">
          <dynamic-select-field
            :options="clients"
            :itemSaved="records.client"
            @update:options="setClients"
            @update:itemSelected="(item) => emitRecords(item, 'client')"
            mainLabel="name"
            :secondLabel="['document']"
            title="Cliente"
            subtitle="ID:"
            :rules="rulesValidation.select.rules"
          >
          </dynamic-select-field>
        </v-col>
        <v-col cols="12" sm="6" lg="3">
          <dynamic-select-field
            :options="sellers"
            :itemSaved="records.seller"
            @update:options="setSellers"
            @update:itemSelected="(item) => emitRecords(item, 'seller')"
            mainLabel="full_name"
            :secondLabel="['identification']"
            title="Vendedor"
            :rules="rulesValidation.select.rules"
          >
          </dynamic-select-field>
        </v-col>

        <v-col cols="12" sm="6" lg="3">
          <v-text-field
            type="datetime-local"
            variant="outlined"
            label="Fecha y hora"
            @update:model-value="(value) => emitRecords(value, 'date')"
            :model-value="records.date"
            :rules="rulesValidation.date.rules"
          ></v-text-field>
        </v-col>
        <v-col cols="12" sm="6" lg="3">
          <v-text-field
            :maxlength="rulesValidation.price.maxLength"
            label="Descuento"
            @update:model-value="
              (value) => emitRecords(value, 'furtherDiscount')
            "
            :model-value="records.furtherDiscount"
            :rules="rulesValidation.price.rules"
            :loading="loading"
            prepend-inner-icon="mdi-cash"
            variant="outlined"
            :disabled="editable"
          ></v-text-field>
        </v-col>
        <v-col cols="12">
          <v-textarea
            label="Observaciones"
            variant="outlined"
            :maxLength="rulesValidation.longTextNull.maxLength"
            :rules="rulesValidation.longTextNull.rules"
            @update:model-value="(value) => emitRecords(value, 'note')"
            :model-value="records.note"
            :loading="loading"
            rows="2"
          ></v-textarea>
        </v-col>
      </v-row>
      <v-card
        class="pt-4 pb-2 px-5"
        variant="outlined"
        title="Datos para planeación"
        v-if="showPlanment"
      >
        <v-row>
          <v-col cols="12" sm="6" lg="3">
            <v-text-field
              :maxlength="rulesValidation.price.maxLength"
              label="Abono"
              @update:model-value="(value) => emitRecords(value, 'payOff')"
              :model-value="records.payOff"
              :rules="rulesValidation.price.rules"
              :loading="loading"
              prepend-inner-icon="mdi-cash"
              variant="outlined"
              :disabled="editable"
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="6" lg="3">
            <v-select
              label="Estado"
              :items="stages"
              item-title="name"
              variant="outlined"
              v-on:update:modelValue="(value) => emitRecords(value, 'stage')"
              :model-value="records.stage"
              :rules="rulesValidation.select.rules"
              :loading="loading"
              return-object
            ></v-select>
          </v-col>
          <v-col cols="12" sm="6" lg="3">
            <v-text-field
              type="datetime-local"
              variant="outlined"
              label="Fecha de inicio"
              :rules="rulesValidation.date.rules"
              @update:model-value="(value) => emitRecords(value, 'startDate')"
              :model-value="records.startDate"
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="6" lg="3">
            <v-text-field
              type="datetime-local"
              variant="outlined"
              label="Fecha de finalización"
              :rules="endDateRule"
              @update:model-value="(value) => emitRecords(value, 'endDate')"
              :model-value="records.endDate"
            ></v-text-field>
          </v-col>
        </v-row>
      </v-card>
    </v-card-text>
  </v-card>
</template>
<script>
import Petition from "@/services/PetitionStructure/Petition.js";
import { RulesValidation } from "@/utils/validations";

import ClientApi from "@/services/Forms/ClientApi";
import UserApi from "@/services/Forms/UserApi";
import DynamicSelectField from "@/components/blocks/DynamicSelectField.vue";
import { useAlertMessageStore } from "@/store/alertMessage";
import { mapStores } from "pinia";
const clientApi = new ClientApi();
const userApi = new UserApi();

const petition = new Petition();

export default {
  props: {
    records: Object,
    showPlanment: Boolean
  },
  components: {
    DynamicSelectField,
  },
  data: () => ({
    editable: false,
    searchClient: "",
    searchSeller: "",
    clients: [],
    sellers: [],
    stages:[],
    typesInvoice: [],
    loading: false,
    searchCiiu: "",
    rulesValidation: RulesValidation,

  }),
  computed: {
    ...mapStores(useAlertMessageStore),
    endDateRule() {
      return [...this.rulesValidation.date.rules,                 (value) =>
                    new Date(value) > new Date(this.records.startDate) ||
                    "La fecha de finalización debe ser mayor a la de inicio. ",]
    }
  },
  methods: {
    emitRecords(item, key) {
      console.log('stage', item);
      this.$emit("update:records", { item: item, key: key });
    },
    async setClients(name = null) {
      const query = name
        ? `&typeKeyword=legal_credencials&keyword=${name}`
        : "";
      this.clients = (await clientApi.read(`format=short${query}`)).data;
    },
    async setSellers(name = null) {
      const query = name ? `&keyword=${name}` : "";
      this.sellers = (
        await userApi.read(`format=short&typeKeyword=third${query}`)
      ).data;
    },
    async setStages() {
      console.log('entry')
      const queryStage = this.records?.stage?.id || 0;
      this.stages = (
        await petition.get("/type-invoices", `planment_stage=${queryStage}`)
      ).data;
    },
    async setTypesInvoice() {

      this.typesInvoice = (
        await petition.get("/type-invoices")
      ).data;
    },
  },
  watch: {
    async searchClient(to) {
      if (to.length > 3) {
        this.setClients(to);
      }
    },
    async searchSeller(to) {
      if (to.length > 3) {
        this.setSellers(to);
      }
    },
  },
  async mounted() {
    this.loading = true;
    try {
      await Promise.all([
        this.setClients(),
        this.setSellers(),
        this.setTypesInvoice(),
        this.setStages()
      ]);
    } catch (error) {
      console.error("Alguna de las funciones falló:", error);
    }
    this.loading = false;
  },
};
</script>
