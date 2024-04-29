import FormsFactory from "./Interface/FormFactory";

export default class ChargeApi extends FormsFactory {
    constructor(){
        super('/charge-parameterization');
    }
}
