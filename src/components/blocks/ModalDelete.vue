<template>
  <v-dialog v-model="modal" width="auto" scrollable>
    <v-card>
      <v-card-title>Se desactivaran {{ deleteItems.length }} registros</v-card-title>
      <v-card-subtitle
        class="pb-5">Listado de {{title}} a inhabilitar:
        </v-card-subtitle
      >
      <v-card-text style="max-height: 300px;">
        <v-list lines="two">
          <v-list-item
            v-for="(item) in deleteItems"
            :key="item[mainKey]"
            :title="titleKey + searchKey(item,mainKey)"
            :subtitle="subtitleKey + (searchKey(item,secondKey) || '')"
          ></v-list-item>
        </v-list>
      </v-card-text>
      <v-card-actions >
        <v-btn
          color="blue-darken-1"
          variant="text"
          @click="sendResponse(false)"
        >
          Cancelar
        </v-btn>
        <v-btn color="blue-darken-1" variant="text" @click="sendResponse(true)">
          Confirmar
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    title: String,
    toggleDelete: Boolean,
    deleteItems: Array,
    mainKey: Array,
    secondKey: Array,
    titleKey: {
      type: String,
      default:''
    },
    subtitleKey: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      modal: this.toggleDelete,
    };
  },

  methods: {
    sendResponse(kind) {
      this.$emit("confirm-delete", { confirm: kind });

    },
      searchKey(item, arrayKeys) {
        let label = item;
        for (let clave of arrayKeys) {
          label = label[clave];
        }

        return label;
      },

  },

};
</script>

<style></style>
