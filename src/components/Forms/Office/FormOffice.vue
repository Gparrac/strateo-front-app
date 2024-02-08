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
            <v-col cols="12" sm="6">
              <v-text-field
                :maxlength="rulesValidation.text.maxLength"
                label="Nombre"
                v-model="editItem.name"
                :rules="rulesValidation.text.rules"
                :loading="loading"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field
                :maxlength="rulesValidation.mobile.maxLength"
                label="Teléfono"
                v-model="editItem.phone"
                :rules="rulesValidation.mobile.rules"
                :loading="loading"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="12">
              <v-text-field
                :maxlength="rulesValidation.text.maxLength"
                label="Dirección"
                v-model="editItem.address"
                :rules="rulesValidation.text.rules"
                :loading="loading"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6">
              <v-autocomplete
                label="Ciudad"
                v-model="editItem.city_id"
                :items="cities"
                v-model:search="searchCity"
                item-title="name"
                item-value="id"
                :rules="rulesValidation.select.rules"
                :loading="loading"
              ></v-autocomplete>
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
import OfficeApi from "@/services/Forms/OfficeApi.js";
import Petition from "@/services/PetitionStructure/Petition.js";
import { RulesValidation } from "@/utils/validations";
import { mapStores } from "pinia";
import { useAlertMessageStore } from "@/store/alertMessage";


const officeApi = new OfficeApi();
const petition = new Petition();

export default {
  name: "FormOffice",
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
    searchCity: "",
    rulesValidation: RulesValidation,
    status: [
      { name: "A", label: "Activo" },
      { name: "I", label: "Inactivo" },
    ],
  }),
  async mounted() {
    this.loading = true;
    try {
      await Promise.all([this.setEditItem(), this.setCities()]);
    } catch (error) {
      console.error("Alguna de las funciones falló:", error);
    }
    this.loading = false;
  },
  computed: {
    title() {
      return this.idEditForm
        ? `Edición de ${this.nameTable}`
        : `Creación de ${this.nameTable}`;
    },
    ...mapStores(useAlertMessageStore),
  },
  watch: {
    async searchCity(to) {
      if (to.length > 1) {
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
        formData.append("name", this.editItem.name);
        formData.append("address", this.editItem.address);
        formData.append("phone", this.editItem.phone);
        formData.append("city_id", this.editItem.city_id);
        formData.append("status", this.editItem.status);

        if (this.idEditForm) {
          formData.append("office_id", this.editItem.office_id);
          response = await officeApi.update(formData);
        } else {
          response = await officeApi.create(formData);
        }
        // logic to show alert 🚨
        if (response.statusResponse != 200) {
          if(response.error && typeof response.error === 'object'){
            this.alertMessageStore.show(false, "Error en la solicitud.",response.error);
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
    async setEditItem() {
      if (!this.idEditForm) return;
      const response = await officeApi.read(`?office_id=${this.idEditForm}`);
      if (response.statusResponse != 200) {
        this.editItem = {};
        return;
      }
      this.editItem = Object.assign(
        {},
        {
          office_id: response.data.id,
          name: response.data.name,
          address: response.data.address,
          phone: response.data.phone,
          city_id: response.data.city_id,
          status: response.data.status,
        }
      );
    },
    async setCities(name = null) {
      const query = name ? `?name=${name}` : "";
      this.cities = (await petition.get("/cities", query)).data;
    },
  },
};
</script>
