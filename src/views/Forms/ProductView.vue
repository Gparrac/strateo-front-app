<template>
  <div>
    <h1 class="pb-7">{{ titleView }}</h1>
    <div>
      <FormProduct
        v-if="isForm"
        :idEditForm="idEditForm"
        :nameTable="nameTable"
        :path="path"
        @close-success="() => $router.push(`/${path}`)"
        @close-form="() => $router.push(`/${path}`)"
      />
      <TableProduct v-else :nameTable="nameTable" :path="path" />
    </div>
    <div></div>
  </div>
</template>

<script>
import { FormProduct, TableProduct } from "@/components/Forms/Product/";
import { getFormRoute } from "@/utils/routes.js";

export default {
  name: "ProductView",
  data: () => ({
    titleView: "Parametrización de Producto",
    nameTable: "productos",
    path: "products",
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
    FormProduct,
    TableProduct,
  },
};
</script>
