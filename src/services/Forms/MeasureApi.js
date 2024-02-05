import FormsFactory from "./Interface/FormFactory";

export default class MeasureApi extends FormsFactory {
    constructor(){
        super('/measure-parameterization');
    }
}
