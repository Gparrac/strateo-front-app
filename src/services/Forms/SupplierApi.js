import FormsFactory from "./Interface/FormFactory";

export default class SuppliereApi extends FormsFactory {
    constructor(){
        super('/supplier-parameterization');
    }
}
