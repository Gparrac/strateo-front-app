<template>
  <div>
    <h1 class="pb-7">{{ titleView }}</h1>
    <div>
      <FormClient
        v-if="isForm"
        :idEditForm="idEditForm"
        :nameTable="nameTable"
        :path="path"
      />
      <TableClient v-else :nameTable="nameTable" :path="path" />
    </div>
    <div></div>
  </div>
</template>

<script>
import { FormClient, TableClient } from "../../components/Forms/Client/index.vue";
import { getFormRoute } from "@/utils/routes.js";

export default {
  name: "ClientView",
  data: () => ({
    titleView: "Parametrización de Clientes",
    nameTable: "Clientes",
    path: "clients",
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
    FormClient,
    TableClient,
  },
};
</script>
