<template>
  <div>
    <h1 class="pb-7">{{ titleView }}</h1>
    <div>
      <FormMeasure
        v-if="isForm"
        :idEditForm="idEditForm"
        :nameTable="nameTable"
        :path="path"
      />
      <TableMeasure v-else :nameTable="nameTable" :path="path" />
    </div>
    <div></div>
  </div>
</template>

<script>
import { FormMeasure, TableMeasure } from "@/components/Forms/Measure/";
import { getFormRoute } from "@/utils/routes.js";

export default {
  name: "MeasureView",
  data: () => ({
    titleView: "Parametrización de Medidas",
    nameTable: "medidas",
    path: "measures",
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
    FormMeasure,
    TableMeasure,
  },
};
</script>
