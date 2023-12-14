<template>
  <div>
    <h1 class="pb-7">{{ titleView }}</h1>
    <div>
      <FormUser v-if="isForm" :idEditForm="idEditForm" />
      <TableUser v-else />
    </div>
    <div></div>
  </div>
</template>

<script>
import { FormUser, TableUser } from "../../components/Forms/User/index.vue";
import { getFormRoute } from "@/utils/routes.js";

export default {
  name: "UserView",
  data: () => ({
    titleView: "Parametrización de Usuarios",

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
    FormUser,
    TableUser,
  },
};
</script>
