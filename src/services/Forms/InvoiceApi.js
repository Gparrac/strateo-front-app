import FormsFactory from "./Interface/FormFactory";

export default class InvoiceApi extends FormsFactory {
    constructor(){
        super('/invoice-parameterization');
    }
    async downloadPdf(invoiceId) {
      await this.petition.getFile('/invoice-pdf', `invoice_id=${invoiceId}`,true, 'invoice.pdf');
    }
    async downloadCompanyPdf(invoiceId){
      try {
        await this.petition.getFile('/invoice-company-pdf', `invoice_id=${invoiceId}`, true, 'invoice.pdf');
      } catch (error) {
        console.error('Error downloading PDF:', error);
      }
    }
}
