import FormsFactory from "./Interface/FormFactory";
import Petition from "../PetitionStructure/Petition";

export default class UserApi extends FormsFactory {
    constructor(){
        super();
        this.petition = new Petition();
        this.route = '/user-parameterization?form_id=5';
    }

    create(body){
        return this.petition.post(this.route, body);
    }

    read(query = ''){
        return this.petition.get(this.route, query);
    }

    update(body){
        return this.petition.put(this.route, body);
    }

    delete(query = ''){
        return this.petition.delete(this.route, query)
    }
}
