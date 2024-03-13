<template>
  <div>
    <h1 class="pb-7">{{ titleView }}</h1>
    <div>
      <FormLibrettoActivity
        v-if="isForm"
        :idEditForm="idEditForm"
        :nameTable="nameTable"
        :path="path"
      />
      <TableLibrettoActivity v-else :nameTable="nameTable" :path="path" />
    </div>
    <div></div>
  </div>
</template>

<script>
import { FormLibrettoActivity, TableLibrettoActivity } from "@/components/Forms/LibrettoActivity/";
import { getFormRoute } from "@/utils/routes.js";

export default {
  name: "LibrettoActivityView",
  data: () => ({
    titleView: "Parametrización de libretos",
    nameTable: "Libreto de actividades",
    path: "libretto-activities",
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
    FormLibrettoActivity,
    TableLibrettoActivity,
  },
};
</script>
