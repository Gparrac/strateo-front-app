import FormsFactory from "./Interface/FormFactory";

export default class TaxValueApi extends FormsFactory {
    constructor(){
        super('/tax-value-parameterization');
    }
}
