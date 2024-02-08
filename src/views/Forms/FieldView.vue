<template>
  <div>
    <h1 class="pb-7">{{ titleView }}</h1>
    <div>
      <FormField
        v-if="isForm"
        :idEditForm="idEditForm"
        :nameTable="nameTable"
        :path="path"
      />
      <TableField v-else :nameTable="nameTable" :path="path" />
    </div>
    <div></div>
  </div>
</template>

<script>
import { FormField, TableField } from "@/components/Forms/Field/";
import { getFormRoute } from "@/utils/routes.js";

export default {
  data: () => ({
    titleView: "Parametrización de Campos",
    nameTable: "campos",
    path: "fields",
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
    FormField,
    TableField,
  },
};
</script>
