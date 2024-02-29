import FormsFactory from "./Interface/FormFactory";

export default class TaxApi extends FormsFactory {
    constructor(){
        super('/tax-parameterization');
    }
}
