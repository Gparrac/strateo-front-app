<template>
  <div>
    <h1 class="pb-7">{{ titleView }}</h1>
    <div>
      <FormBrand
        v-if="isForm"
        :idEditForm="idEditForm"
        :nameTable="nameTable"
        :path="path"
      />
      <TableBrand v-else :nameTable="nameTable" :path="path" />
    </div>
    <div></div>
  </div>
</template>

<script>
import { FormBrand, TableBrand } from "@/components/Forms/Brand/";
import { getFormRoute } from "@/utils/routes.js";

export default {
  name: "BrandView",
  data: () => ({
    titleView: "Parametrización de Marcas",
    nameTable: "marcas",
    path: "brands",
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
    FormBrand,
    TableBrand,
  },
};
</script>
