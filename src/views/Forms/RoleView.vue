<template>
  <div>
    <h1 class="pb-7">{{ titleView }}</h1>
    <div>
      <FormRole v-if="isForm" :idEditForm="idEditForm" />
      <TableRole v-else />
    </div>
    <div></div>
  </div>
</template>

<script>
import { FormRole, TableRole } from "../../components/Forms/Role/index.vue";
import { getFormRoute } from "@/utils/routes.js";

export default {
  name: "RoleView",
  data: () => ({
    titleView: "Parametrización de Roles",

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
    FormRole,
    TableRole,
  },
};
</script>
