import FormsFactory from "./Interface/FormFactory";

export default class InventoryApi extends FormsFactory {
    constructor(){
        super('/inventory-parameterization');
    }
}
