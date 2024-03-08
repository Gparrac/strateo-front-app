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
        >
        <template v-slot:item="{ props, item }">
                          <v-list-item v-bind="props">
                            <v-list-item-subtitle class="d-flex justify-space-between">
                              <span class="d-block">
                                {{ subtitle }}
                                {{
                                  secondLabel && useSearchKey(item.raw,secondLabel)
                              }}</span>
                              <div class="d-flex  align-start">

                              <v-chip v-if="thirdkey" size="x-small">
                                 {{thirdkey?.label }}
                                {{item.raw[thirdkey.id] }}
                              </v-chip>
                            </div>
                            </v-list-item-subtitle>
                          </v-list-item>
                        </template>
        </v-autocomplete>
</template>
<script>
import { searchKey } from '@/utils/cast';
export default {
  props: {
    rules:{
      default: () => ([]),
      required:false,
      type:Array
    },
    options:Array,
    itemSaved: {
      required:false,
      type: Object
    },
    title: String,
    mainLabel: String,
    secondLabel: Array,
    subtitle: String,
    thirdkey: {
      required:false,
      type: Object
    }
  },
  data: () => ({
    searchItem:""
  }),
  watch:{
    async searchItem(to) {
      if (to.length > 2 && to.length < 5) {
        this.$emit("update:options",  to);
      }else if(to.length == 0){
          this.$emit("update:options",  '');

      }

    },
  },
  methods:{
    useSearchKey(item, array){
      return searchKey(item,array)

    }
  }

}
</script>
