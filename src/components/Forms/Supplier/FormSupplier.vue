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
                :key="thirdKeyCard"
                :records="editItem"
                @update:records="
                  (item) => (editItem = { ...editItem, ...item })
                "
              ></thirdFieldCard>
            </v-col>
            <v-col cols="12">
              <v-card rounded="true" elevation="0" title="Datos del provedor">
                <v-card-text>
                  <v-row>
                    <v-col cols="12" sm="6">
                      <v-row>
                        <!-- ----- start commercial registry --------------------->
                        <v-col cols="12">
                          <v-text-field
                            :maxlength="rulesValidation.text.maxLength"
                            label="Registro Comercial"
                            v-model="editItem.commercialRegistryNumber"
                            :rules="rulesValidation.text.rules"
                            :loading="loading"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="8">
                          <v-file-input
                            v-model="editItem.commercialFile"
                            accept=".doc, .docx, .pdf"
                            label="Registro Comercial"
                            prepend-icon="mdi-file-document"
                            :rules="rulesValidation.file.rules"
                            :loading="loading"
                            @change="
                              handleFileFields($event, 'pathCommercialFile')
                            "
                          ></v-file-input>
                        </v-col>
                        <v-col
                          cols="4"
                          class="d-flex align-start justify-center"
                        >
                          <div
                            v-if="
                              !editItem.commercialFile &&
                              !editItem.pathCommercialFile
                            "
                          >
                            <h3>No hay archivo seleccionado</h3>
                          </div>
                          <div v-else>
                            <v-btn
                              class="ma-2"
                              outlined
                              :href="getFileUrl(editItem.pathCommercialFile)"
                              target="_blank"
                              icon="mdi-folder-download"
                              size="small"
                              download
                            >
                            </v-btn>
                          </div>
                        </v-col>
                        <!-- ----- end commercial registry --------------------->
                        <!-- ----- start commercial registry --------------------->
                        <v-col cols="8">
                          <v-file-input
                            v-model="editItem.rutFile"
                            accept=".doc, .docx, .pdf"
                            label="RUT"
                            prepend-icon="mdi-file-document"
                            :rules="rulesValidation.file.rules"
                            :loading="loading"
                            @change="handleFileFields($event, 'pathRutFile')"
                          ></v-file-input>
                        </v-col>
                        <v-col
                          cols="4"
                          class="d-flex align-start justify-center"
                        >
                          <div
                            v-if="!editItem.rutFile && !editItem.pathRutFile"
                          >
                            <h3>No hay archivo seleccionado</h3>
                          </div>
                          <div v-else>
                            <v-btn
                              class="ma-2"
                              outlined
                              :href="getFileUrl(editItem.pathRutFile)"
                              download
                              size="small"
                              target="_blank"
                              icon="mdi-folder-download"
                            >
                            </v-btn>
                          </div>
                        </v-col>
                        <!-- ----- end commercial registry --------------------->
                      </v-row>
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-row>
                        <v-col cols="12">
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
                        <v-col>
                          <v-textarea
                            label="Descripción sdf"
                            v-model="editItem.description"
                            :maxLength="rulesValidation.longText.maxLength"
                            :rules="rulesValidation.longText.rules"
                            :loading="loading"
                            rows="7"
                          ></v-textarea>
                        </v-col>
                      </v-row>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-col>
            <v-col cols="12" class="d-flex align-center">
              <v-card
                title="Campos personalizados"
                variant="outlined"
                padding="2"
                class="w-100"
              >
                <v-card-text>
                  <!------------------------------- DYNAMIC ITEM --------------------------->
                  <dynamic-field-list
                    v-if="editItem.services"
                    :records="editItem.services"
                    @update:records="(item) => (editItem.services = item)"
                    :errorMessage="customAlertError"

                  >
                    <template #dynamic-item-icon="{ raw }">
                      <v-avatar color="grey-lighten-1">
                        <v-icon color="white">{{ raw.type.icon }}</v-icon>
                      </v-avatar>
                    </template>
                    <template #dynamic-item="{ raw }">
                      <v-list-item-subtitle class="d-flex">
                        <span class="d-block">{{ raw.type.name }}</span>
                        <v-spacer></v-spacer>
                        <span class="d-block"
                          >Tamaño maximo: {{ raw.length }}
                        </span>
                      </v-list-item-subtitle>
                    </template>
                    <v-chip class="ma-2" color="primary" label>
                      <v-icon start :icon="record.type.icon"></v-icon>
                      {{ record.type.name }}
                    </v-chip>
                  </dynamic-field-list>
                  <!------------------------------- END DYNAMIC ITEM --------------------------->
                </v-card-text>
              </v-card>
            </v-col>
            <v-col cols="12"> </v-col>
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
import SupplierApi from "@/services/Forms/SupplierApi";
import { RulesValidation } from "@/utils/validations";
import { mapStores } from "pinia";
import { useAlertMessageStore } from "@/store/alertMessage";
import { statusAllowed } from "@/utils/cast";
//import dynamicFieldList from "@/components/Forms/Service/dynamicFieldList.vue";
import dynamicFieldList from "@/components/Forms/Supplier/DynamicFieldList.vue";
import thirdFieldCard from "@/components/Cards/ThirdFieldCard.vue";
const supplierApi = new SupplierApi();

export default {
  props: {
    idEditForm: Number,
    nameTable: String,
    path: String,
  },
  components: {
    dynamicFieldList,
    thirdFieldCard,
  },
  data: () => ({
    // required data
    loading: false,
    editItem: {},
    // optional data
    formRef: null,
    status: [],
    showFileCommercialSelected: null,
    showFileRutSelected: null,
    rulesValidation: RulesValidation,
    customAlertError: {},
    thirdKeyCard:0
  }),
  async mounted() {
    this.loading = true;
    this.status = statusAllowed();
    try {
      await Promise.all([this.setEditItem()]);
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
  methods: {
    handleFileFields(event, item) {
      const files = event.target.files;
      if (files.length > 0) {
        const selectedFile = files[0];
        this.editItem[item] = selectedFile;
      }
    },
    async submitForm() {

      this.loading = true;
      const { valid } = await this.$refs.form.validate();
      if (!this.editItem.services || this.editItem.services.length == 0) {
        this.customAlertError.type = "services";
        this.customAlertError.message = "Debes seleccionar almenos un servicio";
      } else {
        this.customAlertError = {};
      }
      if (valid) {
        //passing validations 🚥
        const formData = new FormData();
        let response = {};
        // third fields 🚥
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
        this.editItem.secondaryCiius.forEach((item, cindex) => {
          formData.append(`secondary_ciiu_ids[${cindex}]`, item.id);
        });

        // supplier fields 🚥
        formData.append(
          "commercial_registry",
          this.editItem.commercialRegistryNumber
        );
        formData.append("note", this.editItem.description);
        formData.append("status", this.editItem.status);
        if (
          this.editItem.commercialFile &&
          typeof this.commercialFile != "string"
        ) {
          formData.append(
            "commercial_registry_file",
            this.editItem.pathCommercialFile
          );
        }
        if (this.editItem.rutFile && typeof this.rutFile != "string") {
          formData.append("rut_file", this.editItem.pathRutFile);
        }
        this.editItem.services.forEach((service, index) => {
          formData.append(`services[${index}][service_id]`, service.id);
          service.fields.forEach((field, findex) => {
            formData.append(
              `services[${index}][fields][${findex}][field_id]`,
              field.id
            );
            if(field.type.id == 'F'){
              if(field.data) {
                formData.append(
                `services[${index}][fields][${findex}][content]`,
                field.pathFile
              );
              }
            }else{
              formData.append(
                `services[${index}][fields][${findex}][content]`,
                field.data
              );
            }
          });
        });

        if (this.idEditForm) {
          formData.append("supplier_id", this.editItem.supplierId);
          response = await supplierApi.update(formData);
        } else {
          response = await supplierApi.create(formData);
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
    getFileUrl(file) {
      if (!file) return "";
      if (typeof file === "string") return file;
      if (typeof file === "object") return URL.createObjectURL(file);
      return;
    },
    async setEditItem() {
      if (!this.idEditForm) {
        this.editItem.services = [];

        return;
      }
      const response = await supplierApi.read(
        `supplier_id=${this.idEditForm}`
      );
      this.editItem = Object.assign(
        {},
        {
          //supplier attributes
          supplierId: response.data.id,
          description: response.data.note,
          status: response.data.status,
          pathCommercialFile: response.data.commercial_registry_file,
          pathRutFile: response.data.rut_file,
          commercialRegistryNumber: response.data.commercial_registry,
          //third attributes
          typeDocument: response.data.third.type_document,
          identification: response.data.third.identification,
          names: response.data.third.names,
          surnames: response.data.third.surnames,
          address: response.data.third.address,
          mobile: response.data.third.mobile,
          email: response.data.third.email,
          postal_code: response.data.third.postal_code,
          city_id: response.data.third.city_id,
          ciiu: response.data.third.ciiu,
          secondaryCiius: response.data.third.secondary_ciius,
          services: response.data.services,
        }
      );

      this.thirdKeyCard = this.thirdKeyCard + 1 ;

    },
  },
};
</script>
