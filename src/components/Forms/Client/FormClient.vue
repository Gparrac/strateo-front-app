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
            <v-col cols="12" sm="4">
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
            <v-col cols="12" sm="4">
              <v-text-field
                :maxlength="rulesValidation.identification.maxLength"
                label="Número de documento"
                v-model="editItem.identification"
                :rules="rulesValidation.identification.rules"
                :loading="loading"
                :suffix="verificationNitNumber"
              ></v-text-field>
            </v-col>
            <template
              v-if="
                editItem.typeDocument && editItem.typeDocument != 'NIT'
              "
            >
              <v-col cols="12" sm="4">
                <v-text-field
                  :maxlength="rulesValidation.text.maxLength"
                  label="Nombres"
                  v-model="editItem.names"
                  :rules="rulesValidation.text.rules"
                  :loading="loading"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="4">
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
              <v-col cols="12" sm="4">
                <v-text-field
                  :maxlength="rulesValidation.text.maxLength"
                  label="Nombre de empresa"
                  v-model="editItem.business"
                  :rules="rulesValidation.text.rules"
                  :loading="loading"
                ></v-text-field>
              </v-col>
            </template>
            <v-col cols="12" sm="4">
              <v-text-field
                :maxlength="rulesValidation.text.maxLength"
                label="Dirección"
                v-model="editItem.address"
                :rules="rulesValidation.text.rules"
                :loading="loading"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="4">
              <v-text-field
                :maxlength="rulesValidation.mobile.maxLength"
                label="Teléfono"
                v-model="editItem.mobile"
                :rules="rulesValidation.mobile.rules"
                :loading="loading"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="4">
              <v-text-field
                :maxlength="rulesValidation.email.maxLength"
                label="Correo Principal"
                v-model="editItem.email"
                placeholder="ejemplo@ejemplo.com"
                :rules="rulesValidation.email.rules"
                :loading="loading"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="4">
              <v-text-field
                :maxlength="rulesValidation.emailOptional.maxLength"
                label="Correo Secundario (opcional)"
                v-model="editItem.email2"
                placeholder="ejemplo@ejemplo.com"
                :rules="rulesValidation.emailOptional.rules"
                :loading="loading"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="4">
              <v-text-field
                :maxlength="rulesValidation.text.maxLength"
                label="Código Postal"
                v-model="editItem.postal_code"
                :rules="rulesValidation.text.rules"
                :loading="loading"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="4">
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
          </v-row>
          <v-row>
            <v-col cols="12" sm="4">
              <v-text-field
                :maxlength="rulesValidation.text.maxLength"
                label="Registro Comercial"
                v-model="editItem.commercial_registry"
                :rules="rulesValidation.text.rules"
                :loading="loading"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="4">
              <v-file-input
                v-model="editItem.commercial_registry_file"
                accept=".doc, .docx, .pdf"
                label="Registro Comercial"
                prepend-icon="mdi-file-document"
                :rules="rulesValidation.file.rules"
                :loading="loading"
                @change="handleFileChange"
              ></v-file-input>
            </v-col>
            <v-col cols="12" sm="4" class="d-flex align-center justify-center ">
              <h3 >asd</h3>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" sm="8">
              <v-file-input
                v-model="editItem.rut_file"
                accept=".doc, .docx, .pdf"
                label="RUT"
                prepend-icon="mdi-file-document"
                :rules="rulesValidation.file.rules"
                :loading="loading"
                @change="handleFileChange"
              ></v-file-input>
            </v-col>
            <v-col cols="12" sm="4" class="d-flex align-center justify-center">
              <h3>asd</h3>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" sm="4">
              <v-text-field
                label="Nombre de Representante Legal"
                v-model="editItem.legal_representative_name"
                :rules="rulesValidation.text.rules"
                :loading="loading"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="4">
              <v-text-field
                label="Nombre de Representante Legal"
                v-model="editItem.legal_representative_name"
                :rules="rulesValidation.text.rules"
                :loading="loading"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="4">
              <v-text-field
                :maxlength="rulesValidation.legal_representative_id"
                label="Identificación del Representante Legal"
                v-model="editItem.identification"
                :rules="rulesValidation.identification.rules"
                :loading="loading"
                :suffix="verificationNitNumber"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="4">
              <v-text-field
                label="Nota"
                v-model="editItem.note"
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
import ClientApi from "@/services/Forms/ClientApi.js";
import Petition from "@/services/PetitionStructure/Petition.js";
import { RulesValidation } from "@/utils/validations";
import { mapStores } from "pinia";
import { useAlertMessageStore } from "@/store/alertMessage";

const clientApi = new ClientApi();
const petition = new Petition();

export default {
  name: "FormClient",
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
    errorMessages: [],
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
          formData.append("client_id", this.editItem.client_id);
          response = await clientApi.update(formData);
        } else {
          response = await clientApi.create(formData);
        }
        if (response.statusResponse != 200) {
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
    async setEditItem() {
      if (!this.idEditForm) return;
      const response = await clientApi.read(`?client_id=${this.idEditForm}`);
      if (response.statusResponse != 200) {
        this.editItem = {};
        return;
      }
      this.editItem = Object.assign(
        {},
        {
          client_id: response.data.id,
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
