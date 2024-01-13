<template>
  <v-form ref="form">
    <v-row justify="center">
      <v-card rounded="3" class="w-100" :loading="loading">
        <v-card-title>
          <span class="text-h5"> Información General </span>
        </v-card-title>

        <!----------------------- FORM --------------------------->
        <v-card-text>
          <v-row>
            <v-col cols="12" lg="12">
              <v-card rounded="true" elevation="0">
                <v-card-text>
                  <!-- Business Name or normal name -->

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
                    <!-- Business Name or normal name -->
                    <v-col cols="12" sm="4" v-else>
                      <v-text-field
                        :maxlength="rulesValidation.text.maxLength"
                        label="Nombre de empresa"
                        v-model="editItem.business"
                        :rules="rulesValidation.text.rules"
                        :loading="loading"
                      ></v-text-field>
                    </v-col>
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
                    <v-col
                      cols="12"
                      :sm="
                        editItem.typeDocument && editItem.typeDocument != 'NIT'
                          ? '6'
                          : '4'
                      "
                    >
                      <v-text-field
                        :maxlength="rulesValidation.email.maxLength"
                        label="Correo Principal"
                        v-model="editItem.email"
                        placeholder="ejemplo@ejemplo.com"
                        :rules="rulesValidation.email.rules"
                        :loading="loading"
                      ></v-text-field>
                    </v-col>
                    <v-col
                      cols="12"
                      :sm="
                        editItem.typeDocument && editItem.typeDocument != 'NIT'
                          ? '6'
                          : '4'
                      "
                    >
                      <v-text-field
                        :maxlength="rulesValidation.email.maxLength"
                        label="Correo Secundario (opcional)"
                        v-model="editItem.email2"
                        placeholder="ejemplo@ejemplo.com"
                        :rules="verificationSecondEmail"
                        :loading="loading"
                      ></v-text-field>
                    </v-col>
                    <v-col
                      cols="12"
                      :sm="
                        editItem.typeDocument && editItem.typeDocument != 'NIT'
                          ? 6
                          : 4
                      "
                    >
                      <v-text-field
                        :maxlength="rulesValidation.text.maxLength"
                        label="Código Postal"
                        v-model="editItem.postal_code"
                        :rules="rulesValidation.text.rules"
                        :loading="loading"
                      ></v-text-field>
                    </v-col>
                    <v-col
                      cols="12"
                      :sm="
                        editItem.typeDocument && editItem.typeDocument != 'NIT'
                          ? 6
                          : 4
                      "
                    >
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
                </v-card-text>
              </v-card>
            </v-col>
            <v-col cols="12" lg="12">
              <v-card
                title="Información de la Empresa"
                variant="outlined"
                padding="2"
              >
                <v-card-text>
                  <v-row>
                    <v-col
                      cols="12"
                      sm="6"
                      class="d-flex align-center justify-center"
                    >
                      <v-file-input
                        label="Logo"
                        v-model="editItem.path_logo"
                        :rules="rulesValidation.image.rules"
                        :loading="loading"
                        accept="image/png, image/jpeg, image/bmp"
                        prepend-icon="mdi-camera"
                        @change="handleImageChange"
                      ></v-file-input>
                    </v-col>
                    <v-col cols="12" sm="6">
                      <div
                        class="d-flex align-center justify-center fill-height"
                        v-if="!editItem.path_logo && !showImageSelected"
                      >
                        <h2>Sin logo seleccionado</h2>
                      </div>
                      <div
                        class="d-flex align-center justify-center fill-height"
                        v-else
                      >
                        <v-img
                          max-width="500"
                          max-height="300"
                          aspect-ratio="16/9"
                          cover
                          :src="getImageUrl(showImageSelected)"
                        ></v-img>
                      </div>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="12" sm="12">
                      <v-textarea
                        label="Encabezado"
                        v-model="editItem.header"
                        :maxLength="rulesValidation.longText.maxLength"
                        :rules="rulesValidation.longText.rules"
                        :loading="loading"
                      ></v-textarea>
                    </v-col>
                    <v-col cols="12" sm="12">
                      <v-textarea
                        label="Pie de página"
                        v-model="editItem.footer"
                        :maxLength="rulesValidation.longText.maxLength"
                        :rules="rulesValidation.longText.rules"
                        :loading="loading"
                      ></v-textarea>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="12" :sm="12">
                      <strong class="text-caption d-block mb-2">* <span class="text-overline">Campo dinamico. </span> Escribe entre 3 a 5 letras para completar la busqueda...</strong>
                      <v-autocomplete
                        label="Codigo principal CIIU"
                        v-model="editItem.ciiu"
                        :items="ciiuCodes"
                        v-model:search="searchCiiu"
                        item-title="description"
                        :return-object="true"
                        :rules="rulesValidation.select.rules"
                        :loading="loading"
                      ></v-autocomplete>
                    </v-col>
                  </v-row>
                  <ciiu-secondary-field v-if="editItem.secondaryCiius" :records="editItem.secondaryCiius" @update:records="(item) => editItem.secondaryCiius = item"></ciiu-secondary-field>
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
            @click="() => $router.push(`/`)"
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
import EnterpriseApi from "@/services/Forms/EnterpriseApi.js";
import Petition from "@/services/PetitionStructure/Petition.js";
import { RulesValidation } from "@/utils/validations";
import CiiuSecondaryField from "./CiiuSecondaryField.vue"
import { mapStores } from "pinia";
import { useAlertMessageStore } from "@/store/alertMessage";
import { castNit } from "@/utils/cast";

const enterpriseApi = new EnterpriseApi();
const petition = new Petition();

export default {
  name: "FormEnterprise",
  props: {
    nameTable: String,
    path: String,
  },
  components: {
    CiiuSecondaryField
  },
  data: () => ({
    // required data
    loading: false,
    editItem: {},
    // optional data
    cities: [],
    searchCity: "",
    ciiuCodes: [],
    searchCiiu: "",
    rulesValidation: RulesValidation,
    showImageSelected: null,
    typesDocument: [],
    isEditForm: false,
  }),
  async mounted() {
    this.loading = true;
    try {
      await Promise.all([
        this.setEditItem(),
        this.setCities(),
        this.setTypesDocument(),
        this.setCiiuCodes()
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
    verificationSecondEmail() {
      return [
        (value) =>
          !value ||
          /\S+@\S+\.\S+/.test(value) ||
          "Formato de correo electrónico inválido",
        (value) =>
          value !== this.editItem.email ||
          "El segundo email debe ser diferente. ",
      ];
    },
    ...mapStores(useAlertMessageStore),
  },
  watch: {
    async searchCity(to) {
      if (to.length > 3) {
        this.setCities(to);
      }
    },
    async searchCiiu(to) {
      if (to.length > 3 && to.length < 5) {
        this.setCiiuCodes(to);
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
        formData.append("verification_id", this.editItem.verification_id);
        formData.append("address", this.editItem.address);
        formData.append("mobile", this.editItem.mobile);
        formData.append("email", this.editItem.email);
        formData.append("code_ciiu_id", this.editItem.ciiu.id);
        if (this.editItem.typeDocument == "NIT") {
          formData.append("business_name", this.editItem.business);
        } else {
          formData.append("names", this.editItem.names);
          formData.append("surnames", this.editItem.surnames);
        }
        if (this.editItem.email2)
          formData.append("email2", this.editItem.email2);
        formData.append("postal_code", this.editItem.postal_code);
        formData.append("city_id", this.editItem.city_id);
        formData.append("code_ciiu_id", this.editItem.ciiu.id);
        formData.append("header", this.editItem.header);
        formData.append("footer", this.editItem.footer);
        if (typeof this.showImageSelected != "string")
          formData.append("path_logo", this.showImageSelected);
        if(this.editItem.secondaryCiius && this.editItem.secondaryCiius.length > 0){
          this.editItem.secondaryCiius.forEach((item, index) => {
            formData.append(`secondary_ciiu_ids[${index}]`,item.id);
          });
        }
        if (this.isEditForm) {
          response = await enterpriseApi.update(formData);
        } else {
          response = await enterpriseApi.create(formData);
        }
        // logic to show alert 🚨
        if (response.statusResponse != 200) {
          if (response.error && typeof response.error === "object") {
            this.alertMessageStore.show(
              false,
              "Error en la solicitud.",
              response.error
            );
          } else {
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
      const response = await enterpriseApi.read();
      if (response.statusResponse != 200) {
        this.editItem = {};
        return;
      }
      this.isEditForm = true;
      this.editItem = Object.assign(
        {},
        {
          enterpriseId: response.data.id,
          typeDocument: response.data.type_document,
          identification: response.data.identification,
          verification_id: response.data.verification_id,
          names: response.data.names ?? null,
          surnames: response.data.surnames ?? null,
          business: response.data.business_name ?? null,
          address: response.data.address,
          mobile: response.data.mobile,
          email: response.data.email,
          email2: response.data.email2,
          postal_code: response.data.postal_code,
          city_id: response.data.city_id,
          ciiu: response.data.ciiu,
          header: response.data.header,
          footer: response.data.footer,
          secondaryCiius: response.data.secondary_ciius
        }
      );
      this.showImageSelected = response.data.path_logo;
    },
    async setCities(name = null) {
      const query = name ? `?name=${name}` : "";
      this.cities = (await petition.get("/cities", query)).data;
    },
    async setCiiuCodes(name = null) {
      const query = name ? `?name=${name}` : "";
      this.ciiuCodes = (await petition.get("/ciiu-codes",query)).data;
    },
    async setTypesDocument() {
      this.typesDocument = (await petition.get("/type-document-user")).data;
    },
    // --------------- Show image ---------------
    handleImageChange(event) {
      const files = event.target.files;
      if (files.length > 0) {
        const selectedFile = files[0];
        this.showImageSelected = selectedFile;
      }
    },
    getImageUrl(file) {
      if (!file) return "";
      if (typeof file === "string") return file;
      return URL.createObjectURL(file);
    },
    // --------------- Show image ---------------
  },
};
</script>
