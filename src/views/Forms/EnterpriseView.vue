<template>
  <div>
    <h1 class="pb-7">{{ titleView }}</h1>
    <div>
      <FormEnterprise v-if="isForm" :idEditForm="idEditForm" />
      <TableEnterprise v-else />
    </div>
    <div></div>
  </div>
</template>

<script>
import { FormEnterprise, TableEnterprise } from "../../components/Forms/Enterprise/index.vue";
import { getFormRoute } from "@/utils/routes.js";

export default {
  name: "EnterpriseView",
  data: () => ({
    titleView: "Parametrización de Empresas",

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
    FormEnterprise,
    TableEnterprise,
  },
};
</script>
