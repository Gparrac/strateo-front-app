<template>
  <v-row>
    <v-col cols="12">
      <strong class="text-caption d-block mb-2"
        >* <span class="text-overline">Campo dinamico. </span> Escribe entre 3 a
        5 letras para completar la busqueda...</strong
      >
      <div class="d-flex">
        <dynamic-select-field
          :options="options"
          :itemSaved="itemSelected"
          @update:options="loadItems"
          @update:itemSelected="(item) => (itemSelected = item)"
          mainLabel="name"
          :secondLabel="['acronym']"
          title="Impuestos"
          subtitle=""
          class="pr-5"
        >
        </dynamic-select-field>
        <v-btn
          v-show="!editable"
          icon="mdi-plus-circle"
          color="primary"
          variant="tonal"
          class="mr-3"
          :disabled="itemSelected ? false : true"
          @click="appendItem"
        >
        </v-btn>
      </div>
    </v-col>
    <v-col class="max-w-custom">
      <v-row v-if="records && records.length > 0">
        <v-col cols="12" v-for="record in records" :key="record.code">
          <v-card>
            <v-card-text>
              <v-row justify="end">
                <v-col cols="5" sm="2">
                  <v-btn
                    v-show="!editable"
                    icon="mdi-delete"
                    size="small"
                    color="warning"
                    variant="tonal"
                    @click="deleteItem(record)"
                  >
                  </v-btn>
                </v-col>
                <v-col cols="7" sm="4" md="4" lg="5">
                  <h6 class="text-h6">{{ record.acronym }}</h6>
                  <span class="font-weight-regular text-blue-grey-lighten-2">{{
                    record.name
                  }}</span>
                </v-col>

                <v-col cols="12" sm="5" md="6" lg="5">
                  <v-text-field
                    :maxlength="rulesValidation.percent.length"
                    label="Porcentaje"
                    :rules="rulesValidation.percent.rules"
                    :loading="loading"
                    append-inner-icon="mdi-brightness-percent"
                    v-model="record.percent"
                    variant="outlined"
                    :disabled="editable"
                    persistent-hint
                    :hint="'% por defecto: ' + record.default_percent"
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
  <div class="d-flex align-center">
    <strong class="text-overline d-block mt-3"
      >Impuestos seleccionados:
    </strong>
    <span class="text-primary d-block text-h5 pt-3 pl-3">{{
      records.length
    }}</span>
  </div>
  <span
    v-if="errorMessage.type && errorMessage.type == 'services'"
    class="text-error text-caption"
  >
    {{ errorMessage.message }}
  </span>
</template>
<script>
import { RulesValidation } from "@/utils/validations";
import DynamicSelectField from "@/components/blocks/DynamicSelectField.vue";
import TaxApi from "@/services/Forms/TaxApi";
const taxApi = new TaxApi();
export default {
  props: {
    records: Array,
    errorMessage: Object,
    editable: Boolean,
  },
  components: {
    DynamicSelectField,
  },
  data: () => ({
    itemSelected: null,
    options: [],
    searchItem: "",
    loading: false,
    rulesValidation: RulesValidation,
  }),

  methods: {
    async loadItems(name = null) {
      let query = `format=short&`;
      query = query + (name ? `keyword=${name}&typeKeyword=acronym` : "");

      const response = await taxApi.read(query);
      this.options = response.data;
    },
    appendItem() {
      const idIndex = this.itemSelected.id;
      const index = this.records.findIndex(function (objeto) {
        return objeto.id === idIndex;
      });

      let newArray = this.records;
      if (index === -1) newArray.push(this.itemSelected);
      this.emitRecords(newArray);
      this.itemSelected = null;
    },
    deleteItem(dropItem) {
      this.emitRecords(this.records.filter((item) => item.id != dropItem.id));
    },
    emitRecords(newRecords) {
      this.$emit("update:records", newRecords);
    },
  },
  async mounted() {
    this.loading = true;
    try {
      await Promise.all([this.loadItems()]);
    } catch (error) {
      console.error("Alguna de las funciones falló:", error);
    }
    this.loading = false;
  },
};
</script>
<style>
.max-w-custom {
  max-height: 530px;
  overflow-y: scroll;
}
</style>
