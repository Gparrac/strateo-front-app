<template>
  <v-autocomplete
    :label="title"
    :model-value="itemSaved"
    v-model:search="searchItem"
    v-on:update:model-value="$emit('update:itemSelected', $event)"
    :item-title="mainLabel"
    :items="options"
    variant="outlined"
    :return-object="true"
    :rules="rules"
    :density="density"
    :custom-filter="filter"
    :no-data-text="customTextNonData"
    :persistent-hint="options.length == 0 ? true : false"
    :hint="options.length == 0 ? `Se require crear ${title} para continuar con esta selección.` : ''"
  >
    <template v-slot:item="{ props, item }">
      <v-list-item v-bind="props">
        <v-list-item-subtitle class="d-flex justify-space-between">
          <span class="d-block">
            {{ subtitle }}
            {{ secondLabel && useSearchKey(item.raw, secondLabel) }}</span
          >
          <div class="d-flex align-start">
            <v-chip v-if="thirdkey" size="x-small">
              {{ thirdkey?.label }}
              {{ item.raw[thirdkey.id] }}
            </v-chip>
          </div>
        </v-list-item-subtitle>
      </v-list-item>
    </template>
  </v-autocomplete>
</template>
<script>
import { searchKey } from "@/utils/cast";
export default {
  props: {
    customTextNonData: {
      default: 'No hay atributos disponible',
      required: false,
      type: String
    },
    rules: {
      default: () => [],
      required: false,
      type: Array,
    },
    customFilter:{
      required: false,
      type: Function,
      default: () => false
    },
    customFilterAble:{
      required: false,
      type: Boolean,
      default: false
    },
    options: Array,
    itemSaved: {
      required: false,
      type: Object,
    },
    title: String,
    mainLabel: String,
    secondLabel: Array,
    subtitle: String,
    thirdkey: {
      required: false,
      type: Object,
    },
    density: {
      required: false,
      type: String,
      default: "default",
    },
  },
  data: () => ({
    searchItem: "",
  }),
  watch: {
    async searchItem(to) {
      if (to.length > 2 && to.length < 6) {
        this.$emit("update:options", to);
      } else if (to.length == 0) {
        this.$emit("update:options", "");
      }
    },
  },
  methods: {
    useSearchKey(item, array) {
      return searchKey(item, array);
    },
    filter (_itemTitle, queryText, item) {
      if(this.customFilterAble)
        return this.customFilter(queryText, item);
      return item;
      },
  },
};
</script>
