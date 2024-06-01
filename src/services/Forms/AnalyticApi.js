import Petition from "../PetitionStructure/Petition";
export default class AnalyticApi {
  constructor() {
    this.token = true;
    this.petition = new Petition();
    this.route = '/analytics';
  }
  read(subRoute = "", query = "") {
    return this.petition.get(this.route + subRoute, query, this.token);
  }

}
