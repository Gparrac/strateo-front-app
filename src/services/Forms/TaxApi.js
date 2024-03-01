import FormsFactory from "./Interface/FormFactory";

export default class OfficeApi extends FormsFactory {
    constructor(){
        super('/tax-parameterization');
    }
}
