import Petition from "../PetitionStructure/Petition";

export default class AuthUser
{
  constructor(){
    this.petition = new Petition();
    this.prefix = '/auth';
  }

  login(body){
    return this.petition.post(`${this.prefix}/login`, body);
  }

  user(){
    return this.petition.get(`${this.prefix}/user`, '', true);
  }

  logout(){
    return this.petition.get(`${this.prefix}/logout`,'',true);
  }
}
