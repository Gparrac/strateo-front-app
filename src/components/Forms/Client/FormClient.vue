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
            <v-col cols="12">
              <thirdFieldCard
                :records="editItem"
                @update:records="updateAttributes"
                :thirdPerson="false"
              ></thirdFieldCard>
            </v-col>
          </v-row>

          <!-- Files upload -->
          <v-row>
            <v-col cols="12" sm="4">
              <v-text-field
                :maxlength="rulesValidation.text.maxLength"
                label="Registro Comercial"
                v-model="editItem.commercial_registry"
                :rules="rulesValidation.shortTextNull.rules"
                :loading="loading"
                variant="outlined"
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
                @change="handleFileCommercialChange"
                variant="outlined"
              ></v-file-input>
            </v-col>
            <v-col cols="12" sm="4" class="d-flex align-center justify-center">
              <div
                v-if="
                  !editItem.commercial_registry_file &&
                  !showFileCommercialSelected
                "
              >
                <h3>No hay archivo seleccionado</h3>
              </div>
              <div v-else>
                <v-btn
                  class="ma-2"
                  outlined
                  :href="getFileUrl(showFileCommercialSelected)"
                  target="_blank"
                  prepend-icon="mdi-folder-download"
                  size="small"
                  download
                >
                  Descargar
                </v-btn>
              </div>
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
                @change="handleFileRutChange"
                variant="outlined"
              ></v-file-input>
            </v-col>
            <v-col cols="12" sm="4" class="d-flex align-center justify-center">
              <div v-if="!editItem.rut_file && !showFileRutSelected">
                <h3>No hay archivo seleccionado</h3>
              </div>
              <div v-else>
                <v-btn
                  class="ma-2"
                  outlined
                  :href="getFileUrl(showFileRutSelected)"
                  download
                  size="x-large"
                  target="_blank"
                  prepend-icon="mdi-folder-download"
                >
                  Descargar
                </v-btn>
              </div>
            </v-col>
          </v-row>
          <!-- Files upload -->

          <v-row>
            <v-col cols="12" sm="6">
              <v-text-field
                label="Nombre de Representante Legal"
                v-model="editItem.legal_representative_name"
                :rules="rulesValidation.shortTextNull.rules"
                :loading="loading"
                variant="outlined"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field
                :maxlength="rulesValidation.legal_representative_id"
                label="Identificación del Representante Legal"
                v-model="editItem.legal_representative_id"
                :rules="rulesValidation.nullIdentification.rules"
                :loading="loading"
                variant="outlined"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field
                label="Nota"
                v-model="editItem.note"
                :rules="rulesValidation.longTextNull.rules"
                :maxLength="rulesValidation.longTextNull.maxLength"
                :loading="loading"
                variant="outlined"
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
                variant="outlined"
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
import ClientApi from "@/services/Forms/ClientApi.js";
import Petition from "@/services/PetitionStructure/Petition.js";
import { RulesValidation } from "@/utils/validations";
import { mapStores } from "pinia";
import { useAlertMessageStore } from "@/store/alertMessage";
import ThirdFieldCard from "@/components/Cards/ThirdFieldCard.vue";
import { castNit } from "@/utils/cast";
const clientApi = new ClientApi();
const petition = new Petition();

export default {
  name: "FormClient",
  props: {
    idEditForm: Number,
    nameTable: String,
    path: String,
  },
  components: {
    ThirdFieldCard,
  },
  data: () => ({
    // required data
    loading: false,
    editItem: {},
    // optional data
    cities: [],
    ciiuCodes: [],
    typesDocument: [],
    rulesValidation: RulesValidation,
    status: [
      { name: "A", label: "Activo" },
      { name: "I", label: "Inactivo" },
    ],
    showFileCommercialSelected: null,
    showFileRutSelected: null,
  }),
  async mounted() {
    this.loading = true;
    try {
      await Promise.all([
        this.setEditItem(),
        this.setCities(),
        this.setTypesDocument(),
        this.setCiiuCodes(),
      ]);
    } catch (error) {
      console.error("Alguna de las funciones falló:", error);
    }
    this.loading = false;
  },
  computed: {
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
    verificationNitNumber() {
      return this.editItem.typeDocument &&
        this.editItem.typeDocument == "NIT" &&
        this.editItem.identification &&
        this.editItem.identification.length > 0
        ? " - " + castNit(this.editItem.identification)
        : "";
    },
    title() {
      return this.idEditForm
        ? `Edición de ${this.nameTable}`
        : `Creación de ${this.nameTable}`;
    },
    ...mapStores(useAlertMessageStore),
  },
  methods: {
    updateAttributes(data) {
      this.editItem[data.key] = data.item;
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
        formData.append("address", this.editItem.address);
        formData.append("mobile", this.editItem.mobile);
        formData.append("email", this.editItem.email);
        if (this.editItem.postal_code)
          formData.append("postal_code", this.editItem.postal_code);
        formData.append("city_id", this.editItem.city.id);
        if (this.editItem.ciiu)
          formData.append("code_ciiu_id", this.editItem.ciiu.id);
        if(this.commercial_registry)
        formData.append(
          "commercial_registry",
          this.editItem.commercial_registry
        );

        formData.append("status", this.editItem.status);
        if(this.legal_representative_name && this.legal_representative_name.length > 0)
        formData.append(
          "legal_representative_name",
          this.editItem.legal_representative_name
        );
        if(this.legal_representative_id && this.legal_representative_id.length > 0)
        formData.append(
          "legal_representative_id",
          this.editItem.legal_representative_id
        );
        if(this.note && this.note.length > 0)
        formData.append("note", this.editItem.note);
        formData.append("status", this.editItem.status);

        if (this.editItem.email2 && this.editItem.email2 != "") {
          formData.append("email2", this.editItem.email2);
        }

        if (this.showFileCommercialSelected && typeof this.showFileCommercialSelected != "string") {
          formData.append(
            "commercial_registry_file",
            this.showFileCommercialSelected
          );
        }
        if (this.showFileRutSelected && typeof this.showFileRutSelected != "string") {
          formData.append("rut_file", this.showFileRutSelected);
        }

        if (this.editItem.business && this.editItem.business.length > 0) {
          formData.append("business_name", this.editItem.business);
        } else {
          formData.append("names", this.editItem.names);
          formData.append("surnames", this.editItem.surnames);
        }

        if (this.idEditForm) {
          formData.append("client_id", this.editItem.client_id);
          response = await clientApi.update(formData);
        } else {
          response = await clientApi.create(formData);
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
      if (!this.idEditForm) return;
      const response = await clientApi.read(`client_id=${this.idEditForm}`);
      if (response.statusResponse != 200) {
        this.editItem = {};
        return;
      }
      this.editItem = Object.assign(
        {},
        {
          client_id: response.data.id,
          typeDocument: response.data.third.type_document,
          identification: response.data.third.identification,
          names: response.data.third.names ?? null,
          surnames: response.data.third.surnames ?? null,
          business: response.data.third.business_name ?? null,
          address: response.data.third.address,
          mobile: response.data.third.mobile,
          email: response.data.third.email,
          email2: response.data.third.email2,
          postal_code: response.data.third.postal_code,
          city: response.data.third.city,
          ciiu: response.data.third.ciiu,
          secondaryCiius: response.data.third.secondary_ciius,
          commercial_registry: response.data.commercial_registry,
          legal_representative_name: response.data.legal_representative_name,
          legal_representative_id: response.data.legal_representative_id,
          note: response.data.note,
          status: response.data.status,
        }
      );
      this.showFileCommercialSelected = response.data.commercial_registry_file;
      this.showFileRutSelected = response.data.rut_file;
    },
    async setCities(name = null) {
      const query = name ? `name=${name}` : "";
      this.cities = (await petition.get("/cities", query)).data;
    },
    async setCiiuCodes(name = null) {
      const query = name ? `name=${name}` : "";
      this.ciiuCodes = (await petition.get("/ciiu-codes", query)).data;
    },
    async setTypesDocument() {
      this.typesDocument = (await petition.get("/type-document-user")).data;
    },

    // --------- Upload Files ----------
    handleFileCommercialChange(event) {
      const files = event.target.files;
      if (files.length > 0) {
        const selectedFile = files[0];
        this.showFileCommercialSelected = selectedFile;
      }
    },
    handleFileRutChange(event) {
      const files = event.target.files;
      if (files.length > 0) {
        const selectedFile = files[0];
        this.showFileRutSelected = selectedFile;
      }
    },
    getFileUrl(file) {
      if (!file) return "";
      if (typeof file === "string") return file;
      if (typeof file === "object") return URL.createObjectURL(file);
      return;
    },

    // --------- Upload Files ----------
  },
};
</script>
