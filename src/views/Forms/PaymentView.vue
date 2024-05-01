<template>
  <div>
    <h1 class="pb-7">{{ titleView }}</h1>
    <div>
      <TablePayment :nameTable="nameTable" :path="path" />
    </div>
    <div></div>
  </div>
</template>

<script>
import {  TablePayment } from "@/components/Forms/Payment/";
import { getFormRoute } from "@/utils/routes.js";

export default {
  data: () => ({
    titleView: "Pagos de planeaciones",
    nameTable: "Pagos",
    path: "payments",
    // isForm: false,
    // idEditForm: null,
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
    TablePayment,
  },
};
</script>
