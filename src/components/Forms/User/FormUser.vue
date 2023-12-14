<template>
  <v-form ref="form">
    <v-row justify="center">
      <v-card rounded="3" class="w-100">
        <v-card-title>
          <span class="text-h5">{{ title }} </span>
        </v-card-title>

        <!----------------------- FORM --------------------------->
        <v-card-text>
          <v-row>
            <v-col cols="12" lg="6">
              <v-card rounded="true" elevation="0">
                <v-card-text>
                  <v-row>
                    <v-col cols="12" sm="6">
                      <v-select
                        label="Tipo de documento"
                        v-model="editUser.typeDocument"
                        item-title="label"
                        item-value="name"
                        :rules="rulesValidation.select"
                      ></v-select>
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-text-field
                        label="Documento"
                        v-model="editUser.identification"
                        :rules="rulesValidation.identification"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-text-field
                        label="Nombres"
                        v-model="editUser.names"
                        :rules="rulesValidation.text"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-text-field
                        label="Apellidos"
                        v-model="editUser.surnames"
                        :rules="rulesValidation.text"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-text-field
                        label="Email"
                        v-model="editUser.email"
                        :rules="rulesValidation.email"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-text-field
                        label="Telefono"
                        v-model="editUser.mobile"
                        :rules="rulesValidation.mobile"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-autocomplete
                        label="Ciudad"
                        v-model="editUser.city"
                        :items="cities"
                        v-model:search="searchCity"
                        item-title="name"
                        :return-object="true"
                        :rules="rulesValidation.select"
                      ></v-autocomplete>
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-select
                        :items="offices"
                        label="Oficina"
                        v-model="editUser.offices"
                        item-title="name"
                        :return-object="true"
                        :rules="rulesValidation.select"
                        multiple
                      ></v-select>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-col>
            <v-col cols="12" lg="6">
              <v-card title="Usuario" variant="outlined" padding="2">
                <v-card-text>
                  <v-row>
                    <v-col cols="12" sm="12">
                      <v-text-field
                        label="Nombre de usuario"
                        v-model="editUser.name"
                        :rules="rulesValidation.text"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-select
                        label="Estado"
                        :items="status"
                        v-model="editUser.status"
                        item-title="label"
                        item-value="name"
                        :rules="rulesValidation.select"
                      ></v-select>
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-select
                        :items="roles"
                        label="Role"
                        v-model="editUser.role"
                        item-title="name"
                        :return-object="true"
                        :rules="rulesValidation.select"
                      ></v-select>
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-text-field
                        label="Contraseña"
                        type="password"
                        v-model="editUser.password"
                        :rules="passwordRule"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-text-field
                        label="Confirmar contraseña"
                        type="password"
                        v-model="editUser.confirmPassword"
                        :rules="confirmPasswordRule"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-card-text>
        <!----------------------- FORM --------------------------->

        <div class="pt-5">
          <small
            v-for="(error, index) in errorMessages"
            :key="index"
            class="text-orange"
          >
            {{ index + 1 + ". " + error }} <br />
          </small>
        </div>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="blue-darken-1"
            variant="text"
            @click="() => $router.push(`/users`)"
            :loading="loading"
          >
            Close
          </v-btn>
          <v-btn
            color="blue-darken-1"
            variant="text"
            @click="submitForm"
            :loading="loading"
          >
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-row>
  </v-form>
</template>

<script>
import UserApi from "@/services/Forms/UserApi.js";
import RoleApi from "@/services/Forms/RoleApi.js";
import Petition from "@/services/PetitionStructure/Petition.js";
import { RulesValidation } from "@/utils/validations";

const userApi = new UserApi();
const roleApi = new RoleApi();
const petition = new Petition();

export default {
  name: "FormUser",
  props: ["idEditForm"],
  components: {},
  data: () => ({
    loading: false,
    cities: [],
    roles: [],
    typesDocument: [],
    offices: [],
    searchCity: "",
    formRef: null,
    errorMessages: [],
    editUser: {},
    status: [
      { name: "A", label: "Activo" },
      { name: "I", label: "Inactivo" },
    ],
    rulesValidation: RulesValidation
  }),
  async mounted() {
    try {
        await Promise.all([
          this.setEditUser(),
          this.setCities(),
          this.setRoles(),
        ]);
      } catch (error) {
        console.error('Alguna de las funciones falló:', error);
      }
  },
  computed: {
    passwordRule() {
      return !this.idEditForm
        ? [
            (value) => !!value || "Contraseña es requerida",
            (value) =>
              (value && value.length >= 6) ||
              "Contraseña debe tener al menos 6 caracteres",
          ]
        : [];
    },
    confirmPasswordRule() {
      return !this.idEditForm
        ? [
            (value) => !!value || "Contraseña es requerida",
            (value) =>
              value === this.editUser.password || "Las contraseñas no coinciden",
          ]
        : [
            (value) =>
              value === this.editUser.password || "Las contraseñas no coinciden",
          ];
    },
    title(){
      return this.idEditForm ? 'Edición de Usuario' : 'Creación de Usuario';
    }
  },
  watch: {
    async searchCity(to) {
      if (to.length > 3) {
        this.setCities(to);
  }
    },
  },
  methods: {
    async submitForm(){
      this.loading = true;
      const { valid } = await this.$refs.form.validate();
  if (valid) {
    //passing validations 🚥
    const formData = new FormData();
    let response = false;
    formData.append("type_document", this.editUser.typeDocument);
    formData.append("identification", this.editUser.identification);
    formData.append("names", this.editUser.names);
    formData.append("surnames", this.editUser.surnames);
    formData.append("address", this.editUser.address);
    formData.append("mobile", this.editUser.mobile);
    formData.append("email", this.editUser.email);
    formData.append("city_id", this.editUser.city.id);
    formData.append("status", this.editUser.status);
    formData.append("role_id", this.editUser.role.id);
    formData.append(
      "offices_id[]",
      this.editUser.offices.map((item) => +item.id)
    );
    formData.append("name", this.editUser.name);

    if (this.idEditForm) {
      console.log("update", this.editUser);
      formData.append("user_id", this.editUser.userId);
      if (this.editUser.password)
        formData.append("password", this.editUser.password);
        await userApi.update(formData);
    } else {
      formData.append("password", this.editUser.password);
      await userApi.create(formData);
    }

    console.log("response", response);
    if (response.error) {
      // lack to define logic to pass show errors in FormUser 🚨
    } else {
      console.log("consesión exitosa!");
      this.$router.push('/users');
      // lack to define logic to pass show alert in TableUser 🚨

    }
  }
    this.loading = false;

    },
    async setTypesDocument(){
      this.typesDocument = (await petition.get('/type-document-user')).data;
    },
    async setRoles(){
      this.typesDocument = (await roleApi.read('type-document-user')).data;
    },
    async setCities(name=null){
      const query = name ? `?name=${name}` : '';
      this.cities = (await petition.get('/cities',query)).data;
  },
    async setEditUser() {
      if (!this.idEditForm) return;
      const response = await userApi.read(`&user_id=${this.idEditForm}`);
        this.editUser = Object.assign(
          {},
          {
            userId: response.data.id,
            name: response.data.name,
            typeDocument: response.data.third.type_document,
            identification: response.data.third.identification,
            names: response.data.third.names,
            surnames: response.data.third.surnames,
            address: response.data.third.address,
            mobile: response.data.third.mobile,
            email: response.data.third.email,
            city: response.data.third.city,
            status: response.data.status,
            role: response.data.role,
            offices: response.data.offices.map((item) => ({
              id: item.id,
              name: item.name,
            })),
          }
        );

    },
  },
};
</script>
