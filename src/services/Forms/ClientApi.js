import FormsFactory from "./Interface/FormFactory";

export default class ClientApi extends FormsFactory {
    constructor(){
        super('/client-parameterization');
    }
}
