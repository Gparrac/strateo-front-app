<template>
  <v-row>
    <v-col cols="12">
      <strong class="text-caption d-block mb-2"
        >* <span class="text-overline">Campo dinamico. </span> Escribe entre 3 a
        5 letras para completar la busqueda...</strong
      >
      <div class="d-flex">
        <v-autocomplete
          label="Campos adicionales"
          v-model="itemSelected"
          :items="options"
          class="flex-grow-1 mr-5"
          v-model:search="searchItem"
          item-title="name"
          :return-object="true"
          :loading="loading"
        >
          <template v-slot:item="{ props, item }">
            <v-list-item v-bind="props">
              <template v-slot:prepend>
                <v-avatar color="grey-lighten-1">
                  <!-- <v-icon color="white">{{item.raw.type.icon}}</v-icon> -->
                  <v-icon color="white">{{ item.raw.type.icon }}</v-icon>
                </v-avatar>
              </template>
              <v-list-item-subtitle class="d-flex">
                <span class="d-block">{{ item.raw.type.name }}</span>
                <v-spacer></v-spacer>
                <span class="d-block"
                  >Tamaño maximo: {{ item.raw.length }}
                </span>
              </v-list-item-subtitle>
            </v-list-item>
          </template>
        </v-autocomplete>
        <v-btn
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
      <v-row>
        <v-col cols="12" lg="6" v-for="record in records" :key="record.code">
          <v-card
            :title="record.name"
            :subtitle="'Tamaño maximo: ' + record.length"
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
</template>
<script>
import { RulesValidation } from "@/utils/validations";
import FieldApi from "@/services/Forms/FieldApi";
const fieldApi = new FieldApi();
export default {
  name: 'DynamicFieldList',
  props: {
    records: Array,
  },
  data: () => ({
    itemSelected: null,
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
      ? `keyword=${name}&typeKeyword=name&format=short`
      : "format=short";
      this.options = (await fieldApi.read(query)).data;
      this.loading = false;
    },
    appendItem() {
      this.emitRecords([this.itemSelected, ...this.records]);
      this.itemSelected = null;
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
<style>
.max-w-custom {
  max-height: 200px;
  overflow-y: scroll;
}
</style>
