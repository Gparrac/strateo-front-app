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
          :secondLabel="['consecutive']"
          title="Productos"
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
                <v-col cols="4" md="2">
                  <v-btn
                    v-show="!editable"
                    icon="mdi-delete"
                    color="warning"
                    variant="tonal"
                    @click="deleteItem(record)"
                  >
                  </v-btn>
                </v-col>
                <v-col cols="8" md="6" lg="7">
                  <h6 class="text-h6">{{ record.name }}</h6>
                  <v-chip class="mx-2">{{ record.measure.symbol }}</v-chip>
                  <v-chip class="mx-2">{{ record.brand.name }}</v-chip>
                  <span class="text-overline">{{ record.product_code }}</span>
                </v-col>

                <v-col cols="12" md="4" lg="3">
                  <v-text-field
                    :maxlength="rulesValidation.price.maxLength"
                    label="Cantidad"
                    :rules="rulesValidation.price.rules"
                    :loading="loading"
                    append-inner-icon="mdi-delete-variant"
                    v-model="record.amount"
                    variant="outlined"
                    :disabled="editable"
                    density="compact"
                    persistent-hint
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
      >Productos seleccionados:
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
import DynamicSelectField from "@/components/blocks/DynamicSelectField.vue";
import ProductApi from "@/services/Forms/ProductApi";
const productApi = new ProductApi();

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

      const query = name ? `&filters[0][key]=name&filters[0][value]=${name}` : "";

      const response = await productApi.read(`format=short${query}`);
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
    }
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
