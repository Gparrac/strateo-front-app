import FormsFactory from "./Interface/FormFactory";
import Petition from "../PetitionStructure/Petition";

export default class UserApi extends FormsFactory {
    constructor(){
        super();
        this.petition = new Petition();
        this.route = '/user-parameterization';
    }

    create(body){
        return this.petition.post(this.route, body, this.token);
    }

    read(query = ''){
        return this.petition.get(this.route, query, this.token);
    }

    update(body){
        return this.petition.put(this.route, body, this.token);
    }

    delete(body){
        return this.petition.delete(this.route, body, this.token)
    }
}
