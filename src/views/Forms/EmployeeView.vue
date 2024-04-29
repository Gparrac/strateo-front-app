<template>
  <div>
    <h1 class="pb-7">{{ titleView }}</h1>
    <div>
      <FormEmployee
        v-if="isForm"
        :idEditForm="idEditForm"
        :nameTable="nameTable"
        :path="path"
      />
      <div v-else>
      <TableEmployee  :nameTable="nameTable" :path="path" />
      <TablePaymentMethod  :nameTable="nameTable" :path="path" />
      <TableCharge  :nameTable="nameTable" :path="path" />
    </div>
    </div>
    <div></div>
  </div>
</template>

<script>
import { FormEmployee, TableEmployee, TablePaymentMethod } from "@/components/Forms/Employee/";
import TableCharge from "@/components/Forms/Employee/TableCharge.vue";
import { getFormRoute } from "@/utils/routes.js";

export default {
  data: () => ({
    titleView: "Parametrización de Empleados",
    nameTable: "empleados",
    path: "employees",
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
    FormEmployee,
    TableEmployee,
    TablePaymentMethod,
    TableCharge
  },
};
</script>
