import FormsFactory from "./Interface/FormFactory";

export default class PaymentMethodApi extends FormsFactory {
    constructor(){
        super('/payment-method-parameterization');
    }
}
