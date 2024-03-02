<template>
  <div>
    <h1 class="pb-7">{{ titleView }}</h1>
    <div>
      <FormPurchaseOrder
        v-if="isForm"
        :idEditForm="idEditForm"
        :nameTable="nameTable"
        :path="path"
      />
      <TablePurchaseOrder v-else :nameTable="nameTable" :path="path" />
    </div>
    <div></div>
  </div>
</template>

<script>
import { FormPurchaseOrder, TablePurchaseOrder } from "@/components/Forms/PurchaseOrder/";
import { getFormRoute } from "@/utils/routes.js";

export default {
  name: "PurchaseOrderView",
  data: () => ({
    titleView: "Ordenes de compra",
    nameTable: "Ordenes de compra",
    path: "purchase-ordes",
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
    FormPurchaseOrder,
    TablePurchaseOrder,
  },
};
</script>
