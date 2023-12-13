import { getUsers } from "@/services/userService";
import { defineStore } from "pinia";

export const useUserStore = defineStore("userStore", {
  state: () => ({

    kindModal: "",
    userEdited: {},
    usersSelected: [],
    records: [],
    loader: false,
    toggleAlert: {
      modal: false,
      type: false
    }
  }),
  getters: {
    title(state) {
      switch (state.kindModal) {
        case "edit":
          return "Edición de usuario";
        case "create":
          return "Creación de usuario";
        default:
          return "Eliminación";
      }
    },
    checkSelected(state) {
      return state.usersSelected.length == 0 ? true : false;
    },

  },
  actions: {
    showAlert(typeAlert){
      this.toggleAlert.type= typeAlert;
      this.toggleAlert.modal = true;
      setTimeout(()=>{
        this.toggleAlert.modal = false;
      },2000)
    },
    setLoader(){
      this.loader = ! this.loader;
    },
    startEdition(type, item){
      this.kindEdited = type;
      this.userEdited = item;
    },
    activeModal(type, item) {
      if (type == "update") {
        this.kindModal = type;
        this.userEdited = item;
        this.toggleModal = true;
      } else {
        this.kindModal = type;
        this.userEdited = {};
        this.toggleModal = true;
      }
    },
    hiddenModal() {
      this.toggleModal = false;
    },
    setSelected(item) {
      this.usersSelected = item;
    },
    async fetchRecords(){
      this.records = await getUsers();
      console.log('temp',this.records);
    }

  },

  // return {toggleModal, userEdited, kindModal, usersSelected, checkSelected, activeModal, hiddenModal, setAtributes,title};
});
