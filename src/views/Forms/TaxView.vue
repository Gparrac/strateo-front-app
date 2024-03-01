<template>
  <div>
    <div class="d-flex pb-5 flex-wrap align-cente">
      <h1 class="pr-10">{{ titleView }}</h1>


    <div class="d-flex align-center justify-center flex-wrap">
    </div>
  </div>
          <FormTax
        v-if="isForm"
        :idEditForm="idEditForm"
        :nameTable="nameTable"
        :path="path"
      />
      <TableTax v-else :nameTable="nameTable" :path="path" />
    <div>

    </div>
    <div></div>
  </div>
</template>

<script>
import { FormTax, TableTax } from "@/components/Forms/Tax/index.vue";

import { getFormRoute } from "@/utils/routes.js";

export default {
  data: () => ({
    titleView: "Impuestos",
    nameTable: "Entrada de impuestos",
    path: "taxes",
    isForm: false,
    idEditForm: null,
    tab:'one'
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
    FormTax,
    TableTax
  },
};
</script>
