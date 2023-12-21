<template>
  <v-form class="d-flex justify-center align-center h-screen" ref="form">
    <v-card width="512" :loading="loader">
      <v-card-title class="text-h4 pt-5 text-center"> Recuperación de contraseña </v-card-title>
      <template v-if="!statusRequest">


      <v-card-subtitle>Digita el correo registrado para la recuperación de tu cuenta ...</v-card-subtitle>
      <v-card-text>

        <v-row>
          <v-col cols="12">
            <v-text-field
              label="Email"
              :rules="rulesValidation.email"
              v-model="email"
            ></v-text-field>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions >
        <v-btn color="orange" @click="recoveryPassword"> Recuperar </v-btn>
        <v-btn color="orange" to="sign-in"> Volver </v-btn>
      </v-card-actions>
    </template>
    <v-card-subtitle  v-else class=" d-block pa-10 "> Envio exitoso. revisa el correo para continuar con la recuperación de tu cuenta!</v-card-subtitle>
    </v-card>
  </v-form>
</template>

<script>
import {RulesValidation} from '@/utils/validations';



export default {
  name: "LoginView",
  data: () => ({
    typeAuth: false,
    email: '',
    loader: false,
    rulesValidation: RulesValidation,
    statusRequest: false,
  }),
  mounted(){
  },
  methods: {
    async recoveryPassword() {
      this.loader = true;
      const { valid } = await this.$refs.form.validate();
      if (valid) {
        const formData = new FormData();
        formData.append("email", this.email);
        // const response = await authUser.recoveryPassword(formData);

        // if(response.statusResponse != 200){
        //   return;
        }
        this.statusRequest = true;
        this.loader = false;
      }

  },
};

</script>
