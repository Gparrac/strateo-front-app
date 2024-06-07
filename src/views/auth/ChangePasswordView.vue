<template>
  <div :class="recoveryRequest ? 'd-flex justify-center align-center h-screen' : ''">
  <v-form class="d-flex justify-center align-center" ref="form">
    <v-card width="512" :loading="loading">
      <v-card-title class="text-h4 py-5 text-center">
       {{ recoveryRequest ? 'Recuperación de credenciales' : 'Cambiar contraseña'}}
      </v-card-title>
      <v-card-subtitle>
        Introduce las nueva contraseña para {{ $route.query.email }}
      </v-card-subtitle>
      <v-card-text>
        <v-row>
          <v-col cols="12">
            <v-text-field
              label="Contraseña actual"
              autocomplete="currently-password"
              :append-inner-icon="showPasswords[0] ? 'mdi-eye-off' : 'mdi-eye'"
              :type="showPasswords[0] ? 'text' : 'password'"
              @click:append-inner="showPasswords[0] = !showPasswords[0]"
              :rules="rulesValidation.password.rules"
              v-model="editItem.oldPassword"
              variant="outlined"
            ></v-text-field>
          </v-col>
          <v-col cols="12">
            <v-text-field
              autocomplete="password"
              label="Nueva contraseña"
              :append-inner-icon="showPasswords[1] ? 'mdi-eye-off' : 'mdi-eye'"
              :type="showPasswords[1] ? 'text' : 'password'"
              @click:append-inner="showPasswords[1] = !showPasswords[1]"
              v-model="editItem.newPassword"
              :rules="passwordRule"
              :loading="loading"
              variant="outlined"
            ></v-text-field>
          </v-col>
          <v-col cols="12">
            <v-text-field
              autocomplete="confirmPassword"
              label="Confirmar contraseña"
              :append-inner-icon="showPasswords[2] ? 'mdi-eye-off' : 'mdi-eye'"
              :type="showPasswords[2] ? 'text' : 'password'"
              @click:append-inner="showPasswords[2] = !showPasswords[2]"
              v-model="editItem.confirmPassword"
              :rules="confirmPasswordRule"
              :loading="loading"
              variant="outlined"
            ></v-text-field>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-btn color="orange" @click="changePassword"> Guardar </v-btn>
        <v-btn color="orange" @click="$router.push('/')"> Volver </v-btn>
      </v-card-actions>
    </v-card>
  </v-form>
</div>
</template>

<script>
import AuthApi from "@/services/auth/AuthUser";
import { RulesValidation } from "@/utils/validations";
import { mapStores } from "pinia";
import { useAlertMessageStore } from "@/store/alertMessage";

const authApi = new AuthApi();
export default {
  data() {
    return {
      showPasswords: [false, false, false],
      loading:false,
      editItem: {},
      recoveryRequest: false,
      rulesValidation: RulesValidation,
    };
  },
  computed: {
    confirmPasswordRule() {
      return [
        (value) => !!value || "Contraseña es requerida",
        (value) =>
          value === this.editItem.newPassword || "Las contraseñas no coinciden",
      ];
    },
    passwordRule() {
      return [
        (value) => !!value || "Contraseña es requerida",
        (value) =>
          value != this.editItem.oldPassword ||
          "La nueva contraseña debe ser diferente a la anterior",
        (value) =>
          (value && value.length >= 6) ||
          "Contraseña debe tener al menos 6 caracteres",
      ];
    },
    ...mapStores(useAlertMessageStore),
  },
  created(){
    if(this.$route.name) this.recoveryRequest = true;
  },
  methods: {
    async changePassword() {
      this.loading = true;
      const { valid } = await this.$refs.form.validate();
      if (valid) {
        //passing validations 🚥
        const formData = new FormData();
        let response = {};

        if(this.recoveryRequest){
          formData.append("password", this.editItem.newPassword);
          formData.append("email", this.$route.query.email);
          formData.append("token", this.$route.query.token);
          response = await authApi.changePassword(formData);
        }else{
          formData.append("old_password", this.editItem.oldPassword);
          formData.append("new_password", this.editItem.newPassword);
          response = await authApi.changePassword(formData);
        }
        // logic to show alert 🚨
        if (response.statusResponse != 200) {
          if (response.error && typeof response.error === "object") {
            this.alertMessageStore.show(
              false,
              "Error en la petición",
              response.error
            );
          } else {
            this.alertMessageStore.show(false, "Error en el servidor.");
          }
        } else {
          this.alertMessageStore.show(true, "Proceso exitoso!");
          this.$router.push('/');

        }
      }
      this.loading = false;
    },
  },
};
</script>
<style>
  .h100{
    height: 100vh;
  }
</style>
