import FormsFactory from "./Interface/FormFactory";

export default class EmployeeApi extends FormsFactory {
    constructor(){
        super('/employee-parameterization');
    }
}
