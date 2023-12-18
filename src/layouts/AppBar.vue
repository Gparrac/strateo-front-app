<template>
  <v-app>

    <v-layout class="">
      <v-app-bar  >
        <v-app-bar-title><span @click="$router.push('/')">STRATEO</span></v-app-bar-title>

        <template v-slot:prepend>
        <v-app-bar-nav-icon
          variant="text"
          @click.stop="drawer = !drawer"
        ></v-app-bar-nav-icon>
      </template>

        <v-spacer></v-spacer>

        <v-btn icon @click="() => toggleSettings=!toggleSettings">
          <v-icon>mdi-account-circle</v-icon>
        </v-btn>
    </v-app-bar>

    <v-navigation-drawer class="pl-3" v-model="drawer" location="left" permanent >
      <v-list-subheader>Sección #1</v-list-subheader>

      <v-list :items="items">

        <v-list-item
        v-for="(item, i) in items"
        :key="i"
        :value="item"
        color="primary"
        :to="item.path"
        >
        <template v-slot:prepend>
          <v-icon :icon="item.icon"></v-icon>
        </template>

        <v-list-item-title>
          <div v-text="item.title"></div>
        </v-list-item-title>
      </v-list-item>
    </v-list>

  </v-navigation-drawer>

  <v-main
  class="d-flex align-start justify-center"
  style="min-height: 100vh"
  >
  <alert-message></alert-message>
    <ModalUserSettings :expand="toggleSettings"></ModalUserSettings>
      <div class="w-100 pa-16">
        <router-view />
      </div>
    </v-main>
  </v-layout>
</v-app>
</template>
<script>
  import AlertMessage from '@/components/blocks/AlertMessage.vue';
  import AuthUser from '@/services/auth/AuthUser';
  import ModalUserSettings from '@/components/blocks/ModalUserSettings.vue';
  import FormApi from "@/services/Forms/FormApi";
  const authUser = new AuthUser();
  const formApi = new FormApi();

  export default {
    name: 'AppBar',
    components:{
      ModalUserSettings,
      AlertMessage
    },
    data: () => ({
      toggleSettings:false,
      drawer: false,
      items: [
        {
          title: "Usuarios",
          value: 1,
          icon: "mdi-account-multiple-plus",
          path: "/users"
        },
        {
          title: "Roles y permisos",
          value: 2,
          icon: "mdi-account-key",
          path:'/roles'
        },
        {
          title: "Empresa",
          value: 3,
          icon: "mdi-factory",
          path:'/enterprises'
        },
        {
          title: "Clientes",
          value: 4,
          icon: "mdi-account-switch",
          path:'/customers'
        },
        {
          title: "Oficinas",
          value: 5,
          icon: "mdi-lan",
          path:'/offices'
        },
      ],

      user: null,
    }),
    mounted(){
      this.checkAuthUser();
      console.log('currently',this.$router.options.routes)
      this.$router.removeRoute('roles');
      console.log('currently',this.$router.options.routes)
    },
    methods: {
      async checkAuthUser() {
        const userData = await authUser.user();
        if(userData.message == 'Unauthenticated.'){
          this.$router.push('/sign-in');
        }
        this.user = userData;
      },
      async getFormsAvailable(){
        // const response =  await formApi.read();


      }

    }
  }
</script>
