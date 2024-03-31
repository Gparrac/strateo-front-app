<template>
  <v-row>
    <v-col cols="12" >
      <strong class="text-caption d-block mb-2"
        >* <span class="text-overline">Campo dinamico. </span> Escribe entre 3 a
        5 letras para completar la busqueda...</strong
      >
      <div class="d-flex">
        <dynamic-select-field
          :options="options"
          @update:options="loadItems"
          @update:itemSelected="appendItem"
          mainLabel="name"
          :secondLabel="['description']"
          title="Libreto de actividades"
          class="pr-5"
        >
        </dynamic-select-field>
      </div>
      <div class="max-h-custom px-5 w-100">
        <v-row v-if="records && records.length > 0">
          <v-col cols="12"  v-for="record in records" :key="record.code">
            <v-card :title="record.name" variant="outlined" :subtitle="record.description">
              <template v-slot:prepend>
                <v-btn
                  v-show="!editable"
                  icon="mdi-delete"
                  color="warning"
                  variant="tonal"
                  @click="deleteItem(record)"
                >
                </v-btn>
              </template>
            </v-card>
          </v-col>
        </v-row>
      </div>
    </v-col>
  </v-row>
  <div class="d-flex align-center">
    <strong class="text-overline d-block mt-3"
      >Total de productos seleccionados:
    </strong>
    <span class="text-primary d-block text-h5 pt-3 pl-3">{{
      records.length
    }}</span>
  </div>
  <span
    v-if="errorMessage.type && errorMessage.type == 'products'"
    class="text-error text-caption"
  >
    {{ errorMessage.message }}
  </span>
</template>
<script>
import { RulesValidation } from "@/utils/validations";
import LibrettoActivityApi from "@/services/Forms/LibrettoActivityApi";
import DynamicSelectField from "@/components/blocks/DynamicSelectField.vue";

const librettoActivityApi = new LibrettoActivityApi();

export default {
  props: {
    records: Array,
    serviceRelatedRecords: Array,
    errorMessage: Object,
    editable: Boolean,
  },
  components: {
    DynamicSelectField,
  },

  data: () => ({
    options: [],
    testOptions: [1],
    loading: false,
    rulesValidation: RulesValidation,
    headersPreLA: [
      { title: "id", align: "start", sortable: false, key: "id" },
      { title: "Actividad", align: "center", sortable: false, key: "name" },
      { title: "Servicio", align: "center", sortable: false, key: "service" },
    ],
  }),
  computed: {
    recordIds() {
      return this.records.map((item) => item.id);
    },
    serviceRecordIds() {
      return this.serviceRelatedRecords.map((item) => item.id);
    },
  },
  methods: {
    async loadItems(name = null) {
      const query = (name ? `&filters[0][key]=name&filters[0][value]=${name}` : "");
      const response = await librettoActivityApi.read(`format=short${query}`);
      this.options = response.data;
    },
    appendItem(item) {
      const index = this.records.findIndex(function (objeto) {
        return objeto.id === item.id;
      });
      let newArray = this.records;
      if (index === -1) newArray.push(item);
      this.emitRecords(newArray);
    },
    deleteItem(itemSelected) {
      this.emitRecords(
        this.records.filter((item) => item.id != itemSelected.id)
      );
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
<style scoped>
.max-h-custom {
  max-height: 430px;
  overflow-y: scroll;
}
</style>
