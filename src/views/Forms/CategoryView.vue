<template>
  <div>
    <h1 class="pb-7">{{ titleView }}</h1>
    <div>
      <FormCategory
        v-if="isForm"
        :idEditForm="idEditForm"
        :nameTable="nameTable"
        :path="path"
      />
      <TableCategory v-else :nameTable="nameTable" :path="path" />
    </div>
    <div></div>
  </div>
</template>

<script>
import { FormCategory, TableCategory } from "@/components/Forms/Category/";
import { getFormRoute } from "@/utils/routes.js";

export default {
  name: "CategoryView",
  data: () => ({
    titleView: "Parametrización de Categorías",
    nameTable: "Categorías",
    path: "categories",
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
    FormCategory,
    TableCategory,
  },
};
</script>
