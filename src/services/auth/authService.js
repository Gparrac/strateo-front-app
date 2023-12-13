import Petition from "../PetitionStructure/Petition";

export default class AuthService
{
  constructor(){
    this.petition = new Petition();
    this.prefix = '/auth';
  }

  signup(body){
    return this.petition.post(`${this.prefix}/signup`, body);
  }

  login(body){
    return this.petition.post(`${this.prefix}/login`, body);
  }

  logout(){
    return this.petition.get(`${this.prefix}/logout`);
  }
}