<template>
  <v-form class="d-flex justify-center align-center" ref="form">
    <v-card width="512" :loading="loader">
      <v-card-title class="text-h4 py-5 text-center">
        Cambiar contraseña
      </v-card-title>

      <v-card-text>
        <v-row>
          <v-col cols="12">
            <v-text-field
              label="Contraseña actual"
              type="password"
              :rules="rulesValidation.password.rules"
              v-model="editItem.oldPassword"
            ></v-text-field>
          </v-col>
          <v-col cols="12">
            <v-text-field
              label="Nueva contraseña"
              type="password"
              v-model="editItem.newPassword"
              :rules="passwordRule"
              :loading="loading"
            ></v-text-field>
          </v-col>
          <v-col cols="12">
            <v-text-field
              label="Confirmar contraseña"
              type="password"
              v-model="editItem.confirmPassword"
              :rules="confirmPasswordRule"
              :loading="loading"
            ></v-text-field>
          </v-col>
        </v-row>
        <div class="pt-5">
          <small
            v-for="(error, index) in errorMessages"
            :key="index"
            class="text-orange"
          >
            {{ index + 1 + ". " + error }} <br />
          </small>
        </div>
      </v-card-text>
      <v-card-actions>
        <v-btn color="orange" @click="changePassword"> Guardar </v-btn>
      </v-card-actions>
    </v-card>
  </v-form>
</template>

<script>
import AuthApi from "@/services/auth/AuthUser";
import { RulesValidation } from "@/utils/validations";
import { errorHandler } from "@/utils/cast";
import { mapStores } from "pinia";
import { useAlertMessageStore } from "@/store/alertMessage";

const authApi = new AuthApi();
export default {
  data() {
    return {
      editItem: {},
      rulesValidation: RulesValidation,
      errorMessages: [],
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
  methods: {
    async changePassword() {
      this.loading = true;
      const { valid } = await this.$refs.form.validate();
      if (valid) {
        //passing validations 🚥
        const formData = new FormData();
        let response = {};
        formData.append("old_password", this.editItem.oldPassword);
        formData.append("new_password", this.editItem.newPassword);
        response = await authApi.changePassword(formData);
        if (response.statusResponse != 200) {
          if (response.error) {
            this.errorMessages = errorHandler(response.error);
          }
          this.alertMessageStore.show(false, "Error en el servidor");
          // lack to define logic to pass show errors in FormUser 🚨
        } else {
          this.alertMessageStore.show(true, "Poceso exitoso!");
          this.$router.push(`/`);
          // lack to define logic to pass show alert in TableUser 🚨
        }
      }
      this.loading = false;
    },
  },
};
</script>
