<template>
  <div>
    <h1 class="pb-7">{{ titleView }}</h1>
    <div>
      <FormOffice
        v-if="isForm"
        :idEditForm="idEditForm"
        :nameTable="nameTable"
        :path="path"
      />
      <TableOffice v-else :nameTable="nameTable" :path="path" />
    </div>
    <div></div>
  </div>
</template>

<script>
import { FormOffice, TableOffice } from "../../components/Forms/Office/index.vue";
import { getFormRoute } from "@/utils/routes.js";

export default {
  name: "OfficeView",
  data: () => ({
    titleView: "Parametrización de oficinas",
    nameTable: "Oficinas",
    path: "offices",
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
    FormOffice,
    TableOffice,
  },
};
</script>
