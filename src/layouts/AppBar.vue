<template>
  <v-app>
  <v-layout class="">
    <v-app-bar title="STRATEO" @click="$router.push('/')">
      <v-app-bar-nav-icon
        variant="text"
        @click.stop="drawer = !drawer"
      ></v-app-bar-nav-icon>
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
            <span v-text="item.title"></span>
          </v-list-item-title>
        </v-list-item>
      </v-list>

    </v-navigation-drawer>

    <v-main
      class="d-flex align-start justify-center"
      style="min-height: 100vh"
    >
      <div class="w-100 pa-16">
        <router-view />
      </div>
    </v-main>
  </v-layout>
</v-app>
</template>
<script>
  import AuthUser from '@/services/auth/AuthUser';
  const authUser = new AuthUser();

  export default {
    name: 'AppBar',
    data: () => ({
      drawer: false,
      items: [
        {
          title: "Usuarios",
          value: 1,
          icon: "mdi-folder",
          path: "/users"
        },
        {
          title: "Roles y permisos",
          value: 2,
          icon: "mdi-folder",
          path:'/roles'
        },
      ],

      user: null,
    }),
    mounted(){
      this.getUserData();
    },
    methods: {
      async getUserData() {
        const userData = await authUser.user();
        if(userData.message == 'Unauthenticated.'){
          this.$router.push('/sign-in');
        }
        this.user = userData;
      }
    }
  }
</script>
