<template>
  <v-form ref="form">
    <v-row justify="center">
      <v-card rounded="3" class="w-100" :loading="loading">
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
                        v-model="editItem.typeDocument"
                        item-title="label"
                        item-value="name"
                        :items="typesDocument"
                        :rules="rulesValidation.select.rules"
                        :loading="loading"
                      ></v-select>
                    </v-col>
                     <v-col cols="12" sm="6">
                      <v-text-field
                        :maxlength="rulesValidation.identification.maxLength"
                        label="Número de documento"
                        v-model="editItem.identification"
                        :rules="rulesValidation.identification.rules"
                        :loading="loading"
                        :suffix="verificationNitNumber"
                      ></v-text-field>
                    </v-col>
                    <template v-if="editItem.typeDocument != 'NIT'">
                      <v-col cols="12">
                        <v-text-field
                          :maxlength="rulesValidation.text.maxLength"
                          label="Nombres"
                          v-model="editItem.names"
                          :rules="rulesValidation.text.rules"
                          :loading="loading"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6">
                        <v-text-field
                          :maxlength="rulesValidation.text.maxLength"
                          label="Apellidos"
                          v-model="editItem.surnames"
                          :rules="rulesValidation.text.rules"
                          :loading="loading"
                        ></v-text-field>
                      </v-col>
                    </template>
                    <template v-else>
                      <v-col cols="12" sm="6">
                      <v-text-field
                        :maxlength="rulesValidation.text.maxLength"
                        label="Nombre de empresa"
                        v-model="editItem.business"
                        :rules="rulesValidation.text.rules"
                        :loading="loading"
                      ></v-text-field>
                    </v-col>
                    </template>
                    <v-col cols="12" sm="6">
                      <v-text-field
                        :maxlength="rulesValidation.email.maxLength"
                        label="Email"
                        v-model="editItem.email"
                        placeholder="johndoe@gmail.com"
                        :rules="rulesValidation.email.rules"
                        :loading="loading"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-text-field
                        :maxlength="rulesValidation.mobile.maxLength"
                        label="Telefono"
                        v-model="editItem.mobile"
                        :rules="rulesValidation.mobile.rules"
                        :loading="loading"
                      ></v-text-field>
                    </v-col>
                   <v-col cols="12" sm="6">
                      <v-autocomplete
                        label="Ciudad"
                        v-model="editItem.city"
                        :items="cities"
                        v-model:search="searchCity"
                        item-title="name"
                        :return-object="true"
                        :rules="rulesValidation.select.rules"
                        :loading="loading"
                      ></v-autocomplete>
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-select
                        :items="offices"
                        label="Oficina"
                        v-model="editItem.offices"
                        item-title="name"
                        :return-object="true"
                        :rules="rulesValidation.select.rules"
                        :loading="loading"
                        multiple
                      ></v-select>
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-text-field
                        :maxlength="rulesValidation.text.maxLength"
                        label="Dirección"
                        v-model="editItem.address"
                        :rules="rulesValidation.text.rules"
                        :loading="loading"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-col>
            <v-col cols="12" lg="6" class="d-flex align-center">
              <v-card title="Usuario" variant="outlined" padding="2" class="w-100">
                <v-card-text>
                  <v-row>
                    <v-col cols="12" sm="12">
                      <v-text-field
                        :maxlength="rulesValidation.text.maxLength"
                        label="Nombre de usuario"
                        v-model="editItem.name"
                        :rules="rulesValidation.text.rules"
                        :loading="loading"
                      ></v-text-field>
                    </v-col>
                   <v-col cols="12" sm="6">
                      <v-select
                        label="Estado"
                        :items="status"
                        v-model="editItem.status"
                        item-title="label"
                        item-value="name"
                        :rules="rulesValidation.select.rules"
                        :loading="loading"
                      ></v-select>
                    </v-col>
                     <v-col cols="12" sm="6">
                      <v-select
                        :items="roles"
                        label="Role"
                        v-model="editItem.role"
                        item-title="name"
                        :return-object="true"
                        :rules="rulesValidation.select.rules"
                        :loading="loading"
                      ></v-select>
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-text-field
                        :maxlength="rulesValidation.password.maxLength"
                        label="Contraseña"
                        type="password"
                        v-model="editItem.password"
                        :rules="passwordRule"
                        :loading="loading"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-text-field
                        :maxlength="rulesValidation.password.maxLength"
                        label="Confirmar contraseña"
                        type="password"
                        v-model="editItem.confirmPassword"
                        :rules="confirmPasswordRule"
                        :loading="loading"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-card-text>
        <!----------------------- FORM --------------------------->


        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="blue-darken-1"
            variant="text"
            @click="() => $router.push(`/${path}`)"
            :loading="loading"
          >
            Cerrar
          </v-btn>
          <v-btn
            color="blue-darken-1"
            variant="text"
            @click="submitForm"
            :loading="loading"
          >
            Guardar
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
import { mapStores } from "pinia";
import { useAlertMessageStore } from "@/store/alertMessage";
import OfficeApi from "@/services/Forms/OfficeApi";
import { castNit, statusAllowed } from "@/utils/cast";

const userApi = new UserApi();
const roleApi = new RoleApi();
const officeApi = new OfficeApi();
const petition = new Petition();

export default {
  name: "FormUser",
  props: {
    idEditForm: Number,
    nameTable: String,
    path: String,
  },
  components: {},
  data: () => ({
    // required data
    loading: false,
    editItem: {},
    // optional data
    cities: [],
    roles: [],
    typesDocument: [],
    offices: [],
    searchCity: "",
    formRef: null,
    status: [],
    rulesValidation: RulesValidation,
  }),
  async mounted() {
    this.loading = true;
    try {
      this.status = statusAllowed();
      await Promise.all([
        this.setEditItem(),
        this.setCities(),
        this.setRoles(),
        this.setTypesDocument(),
        this.setOffices(),
      ]);
    } catch (error) {
      console.error("Alguna de las funciones falló:", error);
    }
    this.loading = false;
  },
  computed: {
    verificationNitNumber() {
      return this.editItem.typeDocument &&
        this.editItem.typeDocument == "NIT" &&
        this.editItem.identification &&
        this.editItem.identification.length > 0
        ? " - " + castNit(this.editItem.identification)
        : "";
    },
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
              value === this.editItem.password ||
              "Las contraseñas no coinciden",
          ]
        : [
            (value) =>
              value === this.editItem.password ||
              "Las contraseñas no coinciden",
          ];
    },
    title() {
      return this.idEditForm
        ? `Edición de ${this.nameTable}`
        : `Creación de ${this.nameTable}`;
    },
    ...mapStores(useAlertMessageStore),
  },
  watch: {
    async searchCity(to) {
      if (to.length > 3) {
        this.setCities(to);
      }
    },
  },
  methods: {
    async submitForm() {
      this.loading = true;
      const { valid } = await this.$refs.form.validate();
      if (valid) {
        //passing validations 🚥
        const formData = new FormData();
        let response = {};
        formData.append("type_document", this.editItem.typeDocument);
        formData.append("identification", this.editItem.identification);
        if (this.editItem.typeDocument == 'NIT'){
          formData.append("business_name", this.editItem.business);
        }else{
          formData.append("names", this.editItem.names);
          formData.append("surnames", this.editItem.surnames);

        }
        formData.append("address", this.editItem.address);
        formData.append("mobile", this.editItem.mobile);
        formData.append("email", this.editItem.email);
        formData.append("city_id", this.editItem.city.id);
        formData.append("status", this.editItem.status);
        formData.append("role_id", this.editItem.role.id);
        this.editItem.offices.forEach((item) => {
          formData.append("offices_id[]", item.id);
        });

        formData.append("name", this.editItem.name);

        if (this.idEditForm) {
          formData.append("user_id", this.editItem.userId);
          if (this.editItem.password)
            formData.append("password", this.editItem.password);
          response = await userApi.update(formData);
        } else {
          formData.append("password", this.editItem.password);
          response = await userApi.create(formData);
        }
        // logic to show alert 🚨
        if (response.statusResponse != 200) {
          if(response.error && typeof response.error === 'object'){
            this.alertMessageStore.show(false, "Error en la solicitud.", response.error);
          }else{
            this.alertMessageStore.show(false, "Error en el servidor.");
          }
        } else {
          this.alertMessageStore.show(true, "Proceso exitoso!");
          this.$router.push(`/${this.path}`);
        }
      }
      this.loading = false;
    },
    async setTypesDocument() {
      this.typesDocument = (await petition.get("/type-document-user")).data;
    },
    async setRoles() {
      this.roles = (await roleApi.read("format=short")).data;
    },
    async setOffices() {
      this.offices = (await officeApi.read("format=short")).data;
      console.log('offices', this.offices);
    },
    async setCities(name = null) {
      const query = name ? `name=${name}` : "";
      this.cities = (await petition.get("/cities", query)).data;
    },
    async setEditItem() {
      if (!this.idEditForm) return;
      const response = await userApi.read(`user_id=${this.idEditForm}`);
      this.editItem = Object.assign(
        {},
        {
          userId: response.data.id,
          name: response.data.name,
          typeDocument: response.data.third.type_document,
          identification: response.data.third.identification,
          names: response.data.third.names,
          surnames: response.data.third.surnames,
          address: response.data.third.address || "",
          mobile: response.data.third.mobile,
          email: response.data.third.email,
          city: response.data.third.city,
          status: response.data.status,
          role: response.data.role,
          business: response.data.third.business_name,
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
