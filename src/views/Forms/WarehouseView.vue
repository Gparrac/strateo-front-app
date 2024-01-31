<template>
  <div>
    <h1 class="pb-7">{{ titleView }}</h1>
    <div>
      <FormWarehouse
        v-if="isForm"
        :idEditForm="idEditForm"
        :nameTable="nameTable"
        :path="path"
      />
      <TableWarehouse v-else :nameTable="nameTable" :path="path" />
    </div>
    <div></div>
  </div>
</template>

<script>
import { FormWarehouse, TableWarehouse } from "@/components/Forms/Warehouse/";
import { getFormRoute } from "@/utils/routes.js";

export default {
  name: "WarehouseView",
  data: () => ({
    titleView: "Parametrización de Bodegas",
    nameTable: "Bodegas",
    path: "warehouses",
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
    FormWarehouse,
    TableWarehouse,
  },
};
</script>
