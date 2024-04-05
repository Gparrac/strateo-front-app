import FormsFactory from "./Interface/FormFactory";

export default class InvoiceApi extends FormsFactory {
    constructor(){
        super('/invoice-parameterization');
    }
    downloadPdf(invoiceId) {
      return this.petition.getFile('/invoice-pdf', `invoice_id=${invoiceId}`,true, 'invoice.pdf');
    }
}
