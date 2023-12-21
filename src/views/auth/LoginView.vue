<template>
  <v-form class="d-flex justify-center align-center h-screen" ref="form">
    <v-card width="512" :loading="loader">
      <v-card-title class="text-h3 pt-5 text-center">
        Inicio de sesión
      </v-card-title>

      <v-card-text>
        <v-row>
          <v-col cols="12">
            <v-switch
              v-model="typeAuth"
              :label="
                'Ingreso por ' + (typeAuth ? 'correo' : 'número de documento')
              "
              :color="typeAuth ? 'orange' : 'primary'"
            ></v-switch>
          </v-col>
          <v-col cols="12" v-if="typeAuth">
            <v-text-field
              :maxlength="rulesValidation.email.maxLength"
              label="Correo"
              v-model="form.email"
              :rules="rulesValidation.email.rules"
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="6" v-if="!typeAuth">
            <v-select
              :items="typesDocument"
              label="Tipo de documento"
              v-model="form.typesDocument"
              item-title="label"
              item-value="name"
              :rules="rulesValidation.select.rules"
            ></v-select>
          </v-col>
          <v-col cols="12" sm="6" v-if="!typeAuth">
            <v-text-field
              :maxlength="rulesValidation.identification.maxLength"
              label="Identificación"
              v-model="form.identification"
              :rules="rulesValidation.identification.rules"
            >
            </v-text-field>
          </v-col>
          <v-col cols="12">
            <v-text-field
              :maxlength="rulesValidation.password.maxLength"
              label="Contraseña"
              type="password"
              :rules="rulesValidation.password.rules"
              v-model="form.password"
            ></v-text-field>
          </v-col>
        </v-row>
        <div class="d-flex justify-end">
          <v-btn
            variant="text"
            class="text-right text-orange text-body-2"
            size="sm"
            @click="$router.push('recovery-password')"
            >Olvidaste tu contraseña?</v-btn
          >
        </div>
      </v-card-text>
      <v-card-actions>
        <v-btn color="orange" @click="logIn"> Iniciar </v-btn>
      </v-card-actions>
    </v-card>
  </v-form>
</template>

<script>
import { RulesValidation } from "@/utils/validations";
import Petition from "@/services/PetitionStructure/Petition";
import AuthUser from "@/services/auth/AuthUser";

const petition = new Petition();
const authUser = new AuthUser();

export default {
  name: "LoginView",
  data: () => ({
    typeAuth: false,
    form: {},
    typesDocument: [],
    loader: false,
    rulesValidation: RulesValidation,
  }),
  mounted() {
    this.getTypeDocument();
  },
  methods: {
    async getTypeDocument() {
      const data = await petition.get("/type-document-user");
      this.typesDocument = data.data;
    },

    async logIn() {
      this.loader = true;
      const { valid } = await this.$refs.form.validate();
      if (valid) {
        const formData = new FormData();
        if (!this.typeAuth) {
          formData.append("type_document", this.form.typesDocument);
          formData.append("identification", this.form.identification);
        } else {
          formData.append("email", this.form.email);
        }
        formData.append("password", this.form.password);
        const response = await authUser.login(formData);

        if (response.statusResponse != 200) {
          var currentUrl = new URL(window.location.href);
          var errorParamExists = currentUrl.searchParams.has("error");
          if (!errorParamExists) {
            currentUrl.searchParams.set("error", "true");
            window.location.href = currentUrl.toString();
          } else {
            window.location.reload(true);
          }
          return;
        }
        localStorage.setItem("auth-token", response.data.access_token);
        localStorage.setItem("user", JSON.stringify(response.user));
        this.$router.push("/");
      }
      this.loader = false;
    },
  },
};
</script>
