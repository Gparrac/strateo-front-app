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
          :secondLabel="['type', 'name']"
          title="Campos"
          :thirdkey="{id:'length', label:'Tamaño maximo: '}"
          subtitle="Tipo:"
          class="pr-5"
        >
        </dynamic-select-field>
      </div>
    </v-col>
    <v-col class="max-w-custom">
      <v-row>
        <v-col cols="12" lg="6" v-for="record in records" :key="record.code">
          <v-card
            :title="record.name"
            :subtitle="'Tamaño maximo: ' + (record.length || 'N.A')"
          >
            <template v-slot:prepend>
              <v-btn
                icon="mdi-delete"
                color="warning"
                variant="tonal"
                @click="deleteItem(record)"
              >
              </v-btn>
            </template>
            <template v-slot:append>
              <v-chip class="ma-2" color="primary" label>
                <v-icon start :icon="record.type.icon"></v-icon>
                {{ record.type.name }}
              </v-chip>
            </template>
            <v-card-text class="d-flex justify-end">
              <div>
                <v-checkbox
                  label="Requerido"
                  single-line
                  hide-details
                  v-model="record.required"
                ></v-checkbox>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
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

  <span v-if="error && error.length > 0" class="text-error text-caption">
    Se requiere minimo un campo relacionado.
  </span>
</template>
<script>
import { RulesValidation } from "@/utils/validations";
import FieldApi from "@/services/Forms/FieldApi";
import DynamicSelectField from "@/components/blocks/DynamicSelectField.vue";
const fieldApi = new FieldApi();
export default {
  name: 'DynamicFieldList',
  props: {
    records: Array,
    error:{
      require: false,
      default: '',
    }
  },
  components:{
    DynamicSelectField
  },
  data: () => ({
    options: [],
    searchItem: "",
    rulesValidation: RulesValidation,
    loading:false,
  }),
  watch: {
    async searchItem(to) {
      if (to.length > 3 && to.length < 5) {
        this.loadItems(to);
      }
    },
  },
  methods: {
    async loadItems(name = null) {
      this.loading = true;
      const query = name
      ? `&filters[0][key]=name&filters[0][value]=${name}` : "";
      this.options = (await fieldApi.read(`format=short${query}`)).data;
      this.loading = false;
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
    await this.loadItems();
  },
};
</script>
<style scoped>
.max-w-custom {
  max-height: 200px;
  overflow-y: scroll;
}
</style>
