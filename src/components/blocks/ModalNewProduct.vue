<template>
  <div>
    <v-btn @click="active = true"   icon="mdi-plus"  variant="tonal" color="primary">
    </v-btn>

    <v-dialog  v-model="active" :close-on-back="true">
      <v-card class="p-7">

      <FormProduct
          :nameTable="nameTable"
          :path="path"
          :type="type"
          @close-form="active = false"
          @close-success="handleSaveForm"
        />

          <div class="pt-2">
        <small
          v-for="(error, index) in alertMessageStore.listErrors"
          :key="index"
          class="text-orange"
        >
          {{ index + 1 + ". " + error }} <br />
        </small>
      </div>

      </v-card>
    </v-dialog>

  </div>
</template>
<script>
import { FormProduct } from "@/components/Forms/Product/";
import ProductApi from "@/services/Forms/ProductApi.js";
import { useAlertMessageStore } from "@/store/alertMessage";
import { mapStores } from 'pinia';
const productApi = new ProductApi();
export default {
  props:{
    type: String // T:TANGIBLE - I:INTANGIBLE
  },

  data: () => ({
    nameTable: "productos",
    path: "products",
    active:false
  }),

  created() {
  },
  computed: {
    ...mapStores(useAlertMessageStore),
  },
  methods:{
    async handleSaveForm(item){
      const response = await productApi.read(`product_id=${item.productId}`);
      this.$emit('new-product', response.data);
      this.active = false;
    }
  },

  components: {
    FormProduct
  },
};
</script>
