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
          @update:options="loadItems"
          @update:itemSelected="appendItem"
          mainLabel="fullname"
          :secondLabel="['identification']"
          title="Empleados"
          class="pr-5"
        >
        </dynamic-select-field>
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
                    color="warning"
                    variant="tonal"
                    @click="deleteItem(record)"
                  >
                  </v-btn>
                </v-col>
                <v-col cols="7" sm="4" md="4" lg="5">
                  <h6 class="text-h6">{{ record.fullname }}</h6>
                  <span class="font-weight-regular text-blue-grey-lighten-2">{{
                    record.identification
                  }}</span>
                </v-col>

                <v-col cols="12" sm="5" md="6" lg="5">
                  <v-text-field
                    :maxlength="rulesValidation.price.length"
                    label="Salario"
                    :rules="rulesValidation.price.rules"
                    :loading="loading"
                    append-inner-icon="mdi-cash"
                    v-model="record.salary"
                    variant="outlined"
                    :disabled="editable"
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
    v-if="errorMessage.type && errorMessage.type == 'employees'"
    class="text-error text-caption"
  >
    {{ errorMessage.message }}
  </span>
</template>
<script>
import { RulesValidation } from "@/utils/validations";
import DynamicSelectField from "@/components/blocks/DynamicSelectField.vue";
import EmployeeApi from "@/services/Forms/EmployeeApi";
const employeeApi = new EmployeeApi();
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
    options: [],
    searchItem: "",
    loading: false,
    rulesValidation: RulesValidation,
  }),

  methods: {
    async loadItems(name = null) {
      let query = `format=short&`;
      query = query + (name ? `keyword=${name}&typeKeyword=name` : "");

      const response = await employeeApi.read(query);
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