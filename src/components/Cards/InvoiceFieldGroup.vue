<template>
  <v-card rounded="true" elevation="0">
    <v-card-text>
      <!-- Business Name or normal name -->
      <v-row>
        <v-col cols="12" :sm="showPlanment ? 4 : 6" :lg="showPlanment ? 4 : 3">
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
        <v-col v-if="!showPlanment" cols="12" sm="6" lg="3">
          <v-select
            label="Tipo de orden"
            :items="types"
            item-title="name"
            variant="outlined"
            v-on:update:modelValue="(value) => changeType(value)"
            :model-value="records.type"
            :rules="rulesValidation.select.rules"
            :loading="loading"
            return-object
          ></v-select>
        </v-col>
        <v-col cols="12" :sm="showPlanment ? 4 : 6" :lg="showPlanment ? 4 : 3">
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

        <v-col cols="12" :sm="showPlanment ? 4 : 6" :lg="showPlanment ? 4 : 3">
          <v-text-field
            type="date"
            variant="outlined"
            :label="'Fecha'"
            @update:model-value="(value) => emitRecords(value, 'date')"
            :model-value="records.date"
            :rules="rulesValidation.date.rules"
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
        class="pt-4 pb-2 px-5 mb-5"
        variant="outlined"
        title="Datos para planeación"
        v-if="showPlanment || (records.type && records.type.id == 'E')"
      >
        <v-row>
          <v-col cols="12" sm="6" lg="3">
            <v-text-field
              :maxlength="rulesValidation.price.maxLength"
              label="Abono"
              @update:model-value="(value) => emitRecords(value, 'payOff')"
              :model-value="records.payOff"
              :rules="rulesValidation.optionalPrice.rules"
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
              :rules="startDateRule"
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
      <v-card
        v-if="records.taxes"
        title="Impuestos"
        variant="outlined"
        padding="2"
        class="w-100 h-100"
      >
        <v-card-text>
          <!------------------------------- DYNAMIC TAXES ITEM --------------------------->
          <dynamic-tax-list
            v-if="records.taxes"
            :records="records.taxes"
            context="I"
            :errorMessage="{}"
            @update:records="(value) => emitRecords(value, 'taxes')"
            :totalCost="totalCost"
          ></dynamic-tax-list>
          <!------------------------------- END DYNAMIC TAXES ITEM --------------------------->
        </v-card-text>
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
import DynamicTaxList from "@/components/blocks/DynamicTaxList.vue";
import { useAlertMessageStore } from "@/store/alertMessage";
import { mapStores } from "pinia";
import { useCheckInvoiceStep } from "@/store/checkInvoiceStep";
const clientApi = new ClientApi();
const userApi = new UserApi();

const petition = new Petition();

export default {
  props: {
    records: Object,
    showPlanment: Boolean,
    totalCost: Number,
  },
  components: {
    DynamicSelectField,
    DynamicTaxList,
  },
  data: () => ({
    editable: false,
    clients: [],
    sellers: [],
    stages: [],
    types: [],
    typesInvoice: [],
    loading: false,
    searchCiiu: "",
    rulesValidation: RulesValidation,
  }),
  computed: {
    ...mapStores(useAlertMessageStore, useCheckInvoiceStep),
    endDateRule() {
      return [
        ...this.rulesValidation.date.rules,
        (value) =>
          new Date(value) > new Date(this.records.startDate) ||
          "La fecha de finalización debe ser mayor a la de inicio. ",
      ];
    },
    startDateRule() {
      let rules = [
        ...this.rulesValidation.date.rules,

        (value) =>
          this.records.endDate
            ? new Date(value) < new Date(this.records.endDate) ||
              "La fecha de inicio debe ser menor a la de finalización. "
            : true,

      ];
      if(!this.records.invoiceId ) rules .push((value) =>
           new Date(value) >= new Date() ||
              "La fecha de incio debe ser mayor o igual a la actual")
      return rules;
    },
  },
  methods: {
    changeType(value) {
      this.$emit("update:type", value);
    },
    emitRecords(item, key) {
      this.checkInvoiceStepStore.handleUpdateInvoiceData()
      this.$emit("update:records", { item: item, key: key });
    },
    async setClients(name = null) {
      const query = name
        ? `&filters[0][key]=legal_credencials&filters[0][value]=${name}`
        : "";
      this.clients = (await clientApi.read(`format=short${query}`)).data;
    },
    async setSellers(name = null) {
      const query = name
        ? `&filters[0][key]=third&filters[0][value]=${name}`
        : "";
      this.sellers = (await userApi.read(`format=short${query}`)).data;
    },
    async setStages(planmentStage = true) {
      const queryStage = planmentStage
        ? `planment_stage=${this.records?.stage?.id || 0}`
        : "";
      this[planmentStage ? "stages" : "types"] = (
        await petition.get("/type-invoices", queryStage)
      ).data;
    },

    async setTypesInvoice() {
      this.typesInvoice = (await petition.get("/type-invoices")).data;
    },
  },
  async mounted() {
    this.loading = true;
    try {
      await Promise.all([
        this.setClients(),
        this.setSellers(),
        this.setTypesInvoice(),
        this.setStages(),
        this.setStages(false),
      ]);
    } catch (error) {
      console.error("Alguna de las funciones falló:", error);
    }
    this.loading = false;
  },
  updated(){

  }
};
</script>
