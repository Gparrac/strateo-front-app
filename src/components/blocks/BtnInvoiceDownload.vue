<template>
  <div class="d-flex justify-end">
  <v-btn icon="mdi-file-outline" color="purple" variant="tonal" :size="size" @click="downloadPDF">
  </v-btn>
</div>
</template>
<script>
import InvoiceApi from '@/services/Forms/InvoiceApi';
const invoiceApi = new InvoiceApi();
export default {
  props:{
    invoiceId: Number,
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
  }
}
</script>
