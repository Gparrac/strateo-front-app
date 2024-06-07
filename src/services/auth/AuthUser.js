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
    return this.petition.get(`${this.prefix}/logout`,'',true)
  }
  reset(body){
    return this.petition.post(`/password/email`, body, true);
  }
  changePassword(body, recovery){
    const path = (recovery) ? this.prefix + '/change-password' : '/password/reset';
    return this.petition.post(`${path}`, body, true);
  }

}
