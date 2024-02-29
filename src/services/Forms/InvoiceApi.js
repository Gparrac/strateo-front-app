import FormsFactory from "./Interface/FormFactory";

export default class InvoiceApi extends FormsFactory {
    constructor(){
        super('/invoice-parameterization');
    }
}
