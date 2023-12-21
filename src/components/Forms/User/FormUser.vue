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
                        :rules="rulesValidation.select"
                        :loading="loading"
                        :disabled="custom"
                        @change="handleVerificationNumber"
                      ></v-select>
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-text-field
                        label="Número de documento"
                        v-model="editItem.identification"
                        :rules="rulesValidation.identification"
                        :loading="loading"
                        :disabled="custom"
                        @change="handleVerificationNumber"
                        :suffix="verificationNit"
                      ></v-text-field>
                    </v-col>
                    <template v-if="editItem.typeDocument != 'NIT'">
                      <v-col cols="12" sm="6">
                        <v-text-field
                          label="Nombres"
                          v-model="editItem.names"
                          :rules="rulesValidation.text"
                          :loading="loading"
                          :disabled="custom"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6">
                        <v-text-field
                          label="Apellidos"
                          v-model="editItem.surnames"
                          :rules="rulesValidation.text"
                          :loading="loading"
                          :disabled="custom"
                        ></v-text-field>
                      </v-col>
                    </template>
                    <v-col cols="12" sm="6">
                      <v-text-field
                        label="Nombre de empresa"
                        v-model="editItem.business"
                        :rules="rulesValidation.text"
                        :loading="loading"
                        :disabled="custom"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-text-field
                        label="Email"
                        v-model="editItem.email"
                        placeholder="johndoe@gmail.com"
                        :rules="rulesValidation.email"
                        :loading="loading"
                        :disabled="custom"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-text-field
                        label="Telefono"
                        v-model="editItem.mobile"
                        :rules="rulesValidation.mobile"
                        :loading="loading"
                        :disabled="custom"
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
                        :rules="rulesValidation.select"
                        :loading="loading"
                        :disabled="custom"
                      ></v-autocomplete>
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-select
                        :items="offices"
                        label="Oficina"
                        v-model="editItem.offices"
                        item-title="name"
                        :return-object="true"
                        :rules="rulesValidation.select"
                        :loading="loading"
                        :disabled="custom"
                        multiple
                      ></v-select>
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-text-field
                        label="Dirección"
                        v-model="editItem.address"
                        :rules="rulesValidation.text"
                        :loading="loading"
                        :disabled="custom"
                      ></v-text-field>
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
                        v-model="editItem.name"
                        :rules="rulesValidation.text"
                        :loading="loading"
                        :disabled="custom"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-select
                        label="Estado"
                        :items="status"
                        v-model="editItem.status"
                        item-title="label"
                        item-value="name"
                        :rules="rulesValidation.select"
                        :loading="loading"
                        :disabled="custom"
                      ></v-select>
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-select
                        :items="roles"
                        label="Role"
                        v-model="editItem.role"
                        item-title="name"
                        :return-object="true"
                        :rules="rulesValidation.select"
                        :loading="loading"
                        :disabled="custom"
                      ></v-select>
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-text-field
                        label="Contraseña"
                        type="password"
                        v-model="editItem.password"
                        :rules="passwordRule"
                        :loading="loading"
                        :disabled="custom"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-text-field
                        label="Confirmar contraseña"
                        type="password"
                        v-model="editItem.confirmPassword"
                        :rules="confirmPasswordRule"
                        :loading="loading"
                        :disabled="custom"
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
    verificationNit: "",
    loading: false,
    editItem: {},
    // optional data
    cities: [],
    roles: [],
    typesDocument: [],
    offices: [],
    searchCity: "",
    formRef: null,
    errorMessages: [],
    status: [
      { name: "A", label: "Activo" },
      { name: "I", label: "Inactivo" },
    ],
    rulesValidation: RulesValidation,
  }),
  async mounted() {
    this.loading = true;
    try {
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
    handleVerificationNumber() {
      console.log('message',this.editItem.typeDocument)
      if (this.editItem.typeDocument == "NIT") {
        const strNit = this.editItem.identification.toString();
        //Vector de numeros primos
        let iNrosPrimos = new Array(
          3,
          7,
          13,
          17,
          19,
          23,
          29,
          37,
          41,
          43,
          47,
          53,
          59,
          67,
          71
        );
        //Variable para realizar las operaciones
        let iOperacion = 0;
        //ciclo para multiplicar cada uno de los digitos del NIT con el vector
        for (let i = 0; i < strNit.length; i++) {
          iOperacion +=
            parseInt(strNit.substr(strNit.length - (i + 1), 1)) *
            iNrosPrimos[i];
        }
        //Sacar el residuo de la operacion
        iOperacion %= 11;
        if (iOperacion == 0 || iOperacion == 1) {
          this.verificationNit = ' - ' + iOperacion;
        } else {
          this.verificationNit = ' - ' + (11 - iOperacion);
        }
      } else {
        this.verificationNit = "";
      }
    },
    async submitForm() {
      this.loading = true;
      const { valid } = await this.$refs.form.validate();
      if (valid) {
        //passing validations 🚥
        const formData = new FormData();
        let response = {};
        formData.append("type_document", this.editItem.typeDocument);
        formData.append("identification", this.editItem.identification);
        if(this.editItem.names) formData.append("names", this.editItem.names);
        if(this.editItem.surnames) formData.append("surnames", this.editItem.surnames);
        if(this.editItem.business) formData.append("business_name", this.editItem.business);
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
        if (response.error) {
          this.alertMessageStore.show(false, "Error en el servidor");
          // lack to define logic to pass show errors in FormUser 🚨
        } else {
          this.alertMessageStore.show(true, "Poceso exitoso!");
          this.$router.push(`/${this.path}`);
          // lack to define logic to pass show alert in TableUser 🚨
        }
      }
      this.loading = false;
    },
    async setTypesDocument() {
      this.typesDocument = (await petition.get("/type-document-user")).data;
    },
    async setRoles() {
      this.roles = (await roleApi.read("")).data;
    },
    async setOffices() {
      this.offices = (await officeApi.read("?format=short")).data;
      console.log("typeDocument", this.offices);
    },
    async setCities(name = null) {
      const query = name ? `?name=${name}` : "";
      this.cities = (await petition.get("/cities", query)).data;
    },
    async setEditItem() {
      if (!this.idEditForm) return;
      const response = await userApi.read(`?user_id=${this.idEditForm}`);
      this.editItem = Object.assign(
        {},
        {
          userId: response.data.id,
          name: response.data.name,
          typeDocument: response.data.third.type_document,
          identification: response.data.third.identification,
          names: response.data.third.names,
          surnames: response.data.third.surnames,
          address: response.data.third.address || '',
          mobile: response.data.third.mobile,
          email: response.data.third.email,
          city: response.data.third.city,
          status: response.data.status,
          role: response.data.role,
          business: response.data.business_name,
          offices: response.data.offices.map((item) => ({
            id: item.id,
            name: item.name,
          })),
        }
      );
      this.handleVerificationNumber();
    },
  },
};
</script>
