<template>
  <div>
    <h1 class="pb-7">{{ titleView }}</h1>
    <div>
      <FormPlanment
        v-if="isForm"
        :idEditForm="idEditForm"
        :nameTable="nameTable"
        :path="path"
      />
      <TablePlanment v-else :nameTable="nameTable" :path="path" />
    </div>
    <div></div>
  </div>
</template>

<script>
import { FormPlanment, TablePlanment } from "@/components/Forms/Planment/";
import { getFormRoute } from "@/utils/routes.js";

export default {
  data: () => ({
    titleView: "Ordenes de planeación",
    nameTable: "ordenes de planeación",
    path: "planments",
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
    FormPlanment,
    TablePlanment,
  },
};
</script>
