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
          mainLabel="name"
          :secondLabel="['description']"
          title="Metodos de pago"

          subtitle=""
          class="pr-5"
        >
        </dynamic-select-field>
      </div>
    </v-col>
    <v-col class="max-w-custom">
      <v-row v-if="records && records.length > 0">
        <v-col cols="12" md="6" v-for="record in records" :key="record.code">
          <v-card>
            <v-card-text>
              <v-row justify="end">

                <v-col cols="12" sm="12"  md="5"  class="d-flex">
                  <v-btn
                    v-show="!editable"
                    icon="mdi-delete"
                    size="small"
                    color="warning"
                    variant="tonal"
                    @click="deleteItem(record)"
                  >
                  </v-btn>
                  <div class="pl-3">
                  <h6 class="text-h6">{{ record.name }}</h6>
                  <span class="font-weight-regular text-blue-grey-lighten-2">{{
                    record.description
                  }}</span>
                  </div>
                </v-col>

                <v-col cols="12" sm="12" md="7" >
                  <v-text-field
                        :maxLength="rulesValidation.text.maxLength"
                        v-model="record.reference"
                        label="Referencia"
                        :rules="rulesValidation.text.rules"
                        density="compact"
                        variant="outlined"
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
      >Total seleccionados:
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

import PaymentMethodApi from "@/services/Forms/PaymentMethodApi";
const paymentMethodApi = new PaymentMethodApi();
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
    loading: false,
    rulesValidation: RulesValidation,
  }),

  methods: {
    async loadItems(name = null) {

      let query = name ? `&filters[0][key]=name&filters[0][value]=${name}` : "";

      const response = await paymentMethodApi.read(`format=short${query}`);
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
