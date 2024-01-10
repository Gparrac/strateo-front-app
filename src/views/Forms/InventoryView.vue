<template>
  <div>
    <h1 class="pb-7">{{ titleView }}</h1>
    <div>
      <FormEntryStock
        v-if="isForm"
        :idEditForm="idEditForm"
        :nameTable="nameTable"
        :path="path"
      />
      <TableEntryStock v-else :nameTable="nameTable" :path="path" />
    </div>
    <div></div>
  </div>
</template>

<script>
import { FormEntryStock, TableEntryStock } from "@/components/Forms/Inventory/index.vue";

import { getFormRoute } from "@/utils/routes.js";

export default {
  name: "UserView",
  data: () => ({
    titleView: "Inventario",
    nameTable: "Entrada de inventario",
    path: "entry-inventory",
    isForm: false,
    idEditForm: null,
  }),
  methods: {
    checkRoute(route) {
      const typeRoute = getFormRoute(route);
      this.isForm = typeRoute.isForm;
      this.idEditForm = typeRoute.idEditForm;
    },
  },
  created() {
    this.checkRoute(this.$route);
  },
  watch: {
    $route(to) {
      this.checkRoute(to);
    },
  },

  components: {
    FormEntryStock,
    TableEntryStock
  },
};
</script>
