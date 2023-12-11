import { defineStore } from 'pinia'


export const useModalStore = defineStore('modal',  {
  state: () => ({
    toggleModal: false,
    kindModal: '',
    data: {},
    usersSelected:[]
  }),
  getters: {
    title(state){
      switch (state.kindModal) {
        case 'edit':
          return 'Edición de usuario';
        case 'create':
          return 'Creación de usuario';
        default:
          return 'Eliminación';
      }
    },
    checkSelected(state){
      return (state.usersSelected.length == 0 ? true : false);
    }
  },
  actions: {
    activeModal(type,item){
      if(type == 'update'){
       this.kindModal = type;
       this.data = item;
       this.toggleModal = true;
      }else{
        this.kindModal = type;
        this.data = {};
        this.toggleModal = true;
      }
  },
  hiddenModal(){
    this.toggleModal = false;
  },
  setSelected(item){
    this.usersSelected = item;
  },
  submitForm(){

    console.log('submit',this.data)
  }
}







  // return {toggleModal, data, kindModal, usersSelected, checkSelected, activeModal, hiddenModal, setAtributes,title};
});
