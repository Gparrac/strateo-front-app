<template>
  <div>
    <h1 class="pb-7">{{ titleView }}</h1>
    <div>
      <FormService
        v-if="isForm"
        :idEditForm="idEditForm"
        :nameTable="nameTable"
        :path="path"
      />
      <TableService v-else :nameTable="nameTable" :path="path" />
    </div>
    <div></div>
  </div>
</template>

<script>
import { FormService, TableService } from "@/components/Forms/Service/";
import { getFormRoute } from "@/utils/routes.js";

export default {
  data: () => ({
    titleView: "Parametrización de Servicios",
    nameTable: "servicios",
    path: "services",
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
    FormService,
    TableService,
  },
};
</script>
