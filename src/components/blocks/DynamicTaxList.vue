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
          mainLabel="acronym"
          :secondLabel="['name']"
          title="Impuestos"
          subtitle=""
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
                  <h6 class="text-h6">{{ record.acronym }}</h6>
                  <span class="font-weight-regular text-blue-grey-lighten-2">{{
                    record.name
                  }}</span>
                  </div>
                </v-col>

                <v-col cols="12" sm="12" md="7" >
                  <v-row justify="end">
                    <v-col v-if="this.totalCost != -1" cols="6" sm="6" md="6">
                      <div >
                      <h3 class="text-subtitle-1 text-sm-h6 font-weight-light text-sm-left text-md-right text-right">
                        {{ castTotalCost(record) }}
                      </h3>
                      <h4 class="text-caption text-sm-subtitle-2 text-right text-sm-left text-md-right font-weight-light">
                        Precio
                      </h4>
                    </div>
                    </v-col>
                    <v-col cols="6" sm="6" :md="totalCost != -1 ? 6 : 12" class="d-flex justify-end">
                      <v-chip
                        variant="tonal"
                        class=""
                        size="small"
                        :prepend-icon="
                          record.type == 'I'
                            ? 'mdi-trending-up'
                            : 'mdi-trending-down'
                        "
                        :color="record.type == 'I' ? 'pink' : 'purple'"
                      >
                        {{ record.type == "I" ? "Incremento" : "Decremento" }}
                      </v-chip>
                    </v-col>
                    <v-col cols="12" md="9" >
                      <v-text-field
                        :maxlength="rulesValidation.percent.length"
                        label="Porcentaje"
                        :rules="rulesValidation.percent.rules"
                        :loading="loading"
                        append-inner-icon="mdi-brightness-percent"
                        v-model="record.percent"
                        variant="outlined"
                        :disabled="editable"
                        density="compact"
                        persistent-hint
                        :hint="'% por defecto: ' + record.default_percent"
                      ></v-text-field>
                    </v-col>
                  </v-row>
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
import { formatNumberToColPesos } from '@/utils/cast';
const taxApi = new TaxApi();
export default {
  props: {
    records: Array,
    errorMessage: Object,
    editable: Boolean,
    context: String,
    totalCost:{
      type:Number,
      default:-1
    },
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
    castTotalCost(item){
      const castTotal = (this.totalCost|| 0) * (item.percent || 0) /100;
      return formatNumberToColPesos(castTotal);
    },
    async loadItems(name = null) {
      let query = `&filters[0][key]=context&filters[0][value]=${this.context}`;
      query += name ? `&filters[0][key]=tax&filters[0][value]=${name}` : "";

      const response = await taxApi.read(`format=short${query}`);
      this.options = response.data;
      console.log("taxes", this.options);
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
    console.log("loading", this.records);
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
