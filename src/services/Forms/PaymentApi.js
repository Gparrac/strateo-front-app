import FormsFactory from "./Interface/FormFactory";

export default class PaymentApi extends FormsFactory {
    constructor(){
        super('/payment-parameterization');
    }
}
