import FormsFactory from "./Interface/FormFactory";

export default class PurchaseOrderApi extends FormsFactory {
    constructor(){
        super('/purchase-order-parameterization');
    }

}
