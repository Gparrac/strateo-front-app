import FormsFactory from "./Interface/FormFactory";

export default class UserApi extends FormsFactory {
    constructor(){
        super('/user-parameterization');
    }
}
