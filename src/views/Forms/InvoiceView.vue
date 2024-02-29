<template>
  <div>
    <h1 class="pb-7">{{ titleView }}</h1>
    <div>
      <FormInvoice
        v-if="isForm"
        :idEditForm="idEditForm"
        :nameTable="nameTable"
        :path="path"
      />
      <TableInvoice v-else :nameTable="nameTable" :path="path" />
    </div>
    <div></div>
  </div>
</template>

<script>
import { FormInvoice, TableInvoice } from "@/components/Forms/Invoice/";
import { getFormRoute } from "@/utils/routes.js";

export default {
  data: () => ({
    titleView: "Ordenes de compra",
    nameTable: "ordenes de compra",
    path: "invoices",
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
    FormInvoice,
    TableInvoice,
  },
};
</script>
