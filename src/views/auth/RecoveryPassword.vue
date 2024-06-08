<template>
    <alert-message v-if="recoveryRequest"></alert-message>
  <v-form class="d-flex justify-center align-center h-screen" ref="form">
    <v-card width="512" :loading="loader">
      <v-card-title class="text-h4 pt-5 text-center"> Recuperación de contraseña </v-card-title>
      <template v-if="!statusRequest">


      <v-card-subtitle>Digita el correo registrado para la recuperación de tu cuenta ...</v-card-subtitle>
      <v-card-text>

        <v-row>
          <v-col cols="12">
            <v-text-field
            variant="outlined"
              label="Email"
              :rules="rulesValidation.email.rules"
              v-model="email"
            ></v-text-field>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions >
        <v-btn color="orange" :loading="loader" @click="recoveryPassword"> Recuperar </v-btn>
        <v-btn color="orange" :loading="loader" to="sign-in"> Volver </v-btn>
      </v-card-actions>
    </template>
    <v-card-subtitle  v-else class=" d-block pa-10 "> {{ alertMessage }}</v-card-subtitle>
    </v-card>
  </v-form>
</template>

<script>
import AuthUser from '@/services/auth/AuthUser';
import {RulesValidation} from '@/utils/validations';
import AlertMessage from "@/components/blocks/AlertMessage.vue";


const authUser = new AuthUser();
export default {
  name: "LoginView",
  components:{
    AlertMessage
  },
  data: () => ({
    typeAuth: false,
    email: '',
    loader: false,
    rulesValidation: RulesValidation,
    statusRequest: false,
    alertMessage: ''
  }),
  methods: {
    async recoveryPassword() {
      this.loader = true;
      const { valid } = await this.$refs.form.validate();
      if (valid) {
        const formData = new FormData();
        formData.append("email", this.email);
        const response = await authUser.reset(formData);

        if (response.statusResponse != 200) {
          if (response.error && typeof response.error === "object") {
            this.alertMessage = 'Error en la petición'
          } else {
            this.alertMessage = 'Error en el servidor'
          }
        } else {
          this.alertMessage = 'Envio exitoso. revisa el correo para continuar con la recuperación de tu cuenta!';
        }
        }
        this.statusRequest = true;
        this.loader = false;
      }

  },
};

</script>
