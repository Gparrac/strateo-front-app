<template>
  <div class="d-flex justify-center ga-2">
  <v-btn icon="mdi-file-outline" color="purple" variant="tonal" :size="size" @click="downloadPDF" >
  </v-btn>
  <v-btn v-if="exportProductPlanment" icon="mdi-file-table" color="primary" variant="tonal" :size="size" @click="downloadCompanyPDF" >
  </v-btn>

</div>
</template>
<script>
import InvoiceApi from '@/services/Forms/InvoiceApi';
const invoiceApi = new InvoiceApi();
export default {
  props:{
    invoiceId: Number,
    exportProductPlanment:{
      default: false,
      type: Boolean,
      required: false
    },
    size:{
      default: 'default',
      type: String,
      required: false
    }
  },

  methods:{
    async downloadPDF(){

      await invoiceApi.downloadPdf(this.invoiceId);

    },
    async downloadCompanyPDF(){

    await invoiceApi.downloadCompanyPdf(this.invoiceId);
    }
  }
}
</script>
