<template>
  <div>
    <h1 class="pb-7">{{ titleView }}</h1>
    <div>
      <FormEnterprise
        :nameTable="nameTable"
        :path="path"
      />
    </div>
    <div></div>
  </div>
</template>

<script>
import { FormEnterprise } from "../../components/Forms/Enterprise/index.vue";

export default {
  name: "EnterpriseView",
  data: () => ({
    titleView: "Parametrización de Empresa",
    nameTable: "Empresas",
    path: "enterprises",
  }),
  components: {
    FormEnterprise,
  },
};
</script>
