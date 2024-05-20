<template>
  <div>
    <h1 class="pb-7">{{ titleView }}</h1>
    <div>
      <FormSupplier
        v-if="isForm"
        :idEditForm="idEditForm"
        :nameTable="nameTable"
        :path="path"
      />
      <TableSupplier v-else :nameTable="nameTable" :path="path" />
    </div>
    <div></div>
  </div>
</template>

<script>
import { FormSupplier, TableSupplier } from "@/components/Forms/Supplier/";
import { getFormRoute } from "@/utils/routes.js";

export default {
  data: () => ({
    titleView: "Parametrización de Proveedores",
    nameTable: "proveedores",
    path: "suppliers",
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
    FormSupplier,
    TableSupplier,
  },
};
</script>
