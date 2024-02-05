import FormsFactory from "./Interface/FormFactory";

export default class ProductApi extends FormsFactory {
    constructor(){
        super('/product-parameterization');
    }
}
