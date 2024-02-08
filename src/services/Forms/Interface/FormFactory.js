import Petition from "../../PetitionStructure/Petition";
export default class FormsFactory {
  constructor(route) {
    this.token = true;
    this.petition = new Petition();
    this.route = route;
  }
  create(body) {
    return this.petition.post(this.route, body, this.token);
  }

  read(query = "") {
    return this.petition.get(this.route, query, this.token);
  }

  update(body) {
    return this.petition.put(this.route, body, this.token);
  }

  delete(query = "") {
    return this.petition.delete(this.route, query, this.token);
  }
}
