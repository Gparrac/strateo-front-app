<template>
  <div>
    <div class="d-flex pb-5 flex-wrap align-cente">
      <h1 class="pr-10">{{ titleView }}</h1>


    <div class="d-flex align-center justify-center flex-wrap">
    </div>
  </div>
          <FormInventoryTrade
        v-if="isForm"
        :idEditForm="idEditForm"
        :nameTable="nameTable"
        :path="path"
      />
      <TableInventoryTrade v-else :nameTable="nameTable" :path="path" />
    <div>

    </div>
    <div></div>
  </div>
</template>

<script>
import { FormInventoryTrade, TableInventoryTrade } from "@/components/Forms/Inventory/index.vue";

import { getFormRoute } from "@/utils/routes.js";

export default {
  data: () => ({
    titleView: "Inventario",
    nameTable: "Entrada de inventario",
    path: "inventory-trades",
    isForm: false,
    idEditForm: null,
    tab:'one'
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
    FormInventoryTrade,
    TableInventoryTrade
  },
};
</script>
