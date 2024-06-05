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
                :thirdPerson="true"
              ></thirdFieldCard>
            </v-col>
            <v-col cols="12">
              <v-card rounded="true" elevation="0" title="Datos del empleado">
                <v-card-text>
                  <v-row>
                    <v-col cols="12" sm="6">
                      <v-row>
                        <!-- ----- start commercial registry --------------------->
                        <v-col cols="12">
                          <v-select
                            label="Tipo de Contrato"
                            v-model="editItem.typeContract"
                            item-title="name"
                            item-value="id"
                            :items="typesContract"
                            :rules="rulesValidation.select.rules"
                            :loading="loading"
                            variant="outlined"
                          ></v-select>
                        </v-col>
                        <v-col cols="8">
                          <v-file-input
                            v-model="editItem.resumeFile"
                            accept=".doc, .docx, .pdf"
                            label="Hoja de vida"
                            prepend-icon="mdi-file-account"
                            :rules="rulesValidation.file.rules"
                            :loading="loading"
                            @change="handleFileFields($event, 'pathResumeFile')"
                            variant="outlined"
                          ></v-file-input>
                        </v-col>
                        <v-col
                          cols="4"
                          class="d-flex align-start justify-center"
                        >
                          <div
                            v-if="
                              !editItem.resumeFile && !editItem.pathResumeFile
                            "
                          >
                            <h3>No hay archivo seleccionado</h3>
                          </div>
                          <div v-else>
                            <v-btn
                              class="ma-2"
                              outlined
                              :href="getFileUrl(editItem.pathResumeFile)"
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
                            variant="outlined"
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
                            variant="outlined"
                          ></v-select>
                        </v-col>

                        <v-col cols="12">
                          <v-text-field
                            type="date"
                            v-model="editItem.hireDate"
                            label="Inicio del contrato"
                            :rules="startDateRule"
                            variant="outlined"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12">
                          <v-text-field
                            type="date"
                            v-model="editItem.endDateContract"
                            label="Finalización del contrato"
                            :rules="rulesValidation.nulldate.rules"
                            variant="outlined"
                            hint="Si no se ha establecido, dejar vacio este campo."
                          ></v-text-field>
                        </v-col>
                      </v-row>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-col>
            <v-col cols="12" class="d-flex align-center">
              <v-card
              v-if="editItem.paymentMethods"
                title="Metodos de pago"
                variant="outlined"
                padding="2"
                class="w-100"
              >
                <v-card-text>
                  <!------------------------------- DYNAMIC ITEM --------------------------->
                  <dynamic-payment-method-items
                    :records="editItem.paymentMethods"
                    :errorMessage="customAlertError"
                    :editable="loading"
                    @update:records="(item) => editItem.paymentMethods = item"
                  ></dynamic-payment-method-items>
                  <!------------------------------- END DYNAMIC ITEM --------------------------->
                </v-card-text>
              </v-card>
            </v-col>
            <v-col cols="12" class="d-flex align-center">
              <v-card
              v-if="editItem.services"
                title="Servicios relacionados"
                variant="outlined"
                padding="2"
                class="w-100"
              >
                <v-card-text>
                  <!------------------------------- DYNAMIC ITEM --------------------------->
                  <dynamic-field-list

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
import EmployeeApi from "@/services/Forms/EmployeeApi";
import { RulesValidation } from "@/utils/validations";
import { mapStores } from "pinia";
import { useAlertMessageStore } from "@/store/alertMessage";
import { castFullDate, statusAllowed } from "@/utils/cast";
import dynamicFieldList from "@/components/blocks/DynamicFieldList.vue";
import thirdFieldCard from "@/components/Cards/ThirdFieldCard.vue";
import DynamicPaymentMethodItems from "@/components/Forms/Employee/DynamicPaymentMethodItems.vue";
import Petition from "@/services/PetitionStructure/Petition.js";
const employeeApi = new EmployeeApi();
const petition = new Petition();
export default {
  props: {
    idEditForm: Number,
    nameTable: String,
    path: String,
  },
  components: {
    dynamicFieldList,
    thirdFieldCard,
    DynamicPaymentMethodItems,
  },
  data: () => ({
    // required data
    loading: false,
    editItem: {},

    // optional data
    formRef: null,
    typesContract: [],
    status: [],
    showFileCommercialSelected: null,
    showFileRutSelected: null,
    rulesValidation: RulesValidation,
    customAlertError: {},
    thirdKeyCard: 0,
  }),
  async mounted() {
    this.loading = true;
    this.status = statusAllowed();
    try {
      await Promise.all([this.setEditItem(), this.setTypesContract()]);
    } catch (error) {
      console.error("Alguna de las funciones falló:", error);
    }
    this.loading = false;
  },
  computed: {
    startDateRule() {
      return [
        ...this.rulesValidation.date.rules,
        (value) =>
        {
          if (this.editItem.endDateContract !== null && this.editItem.endDateContract !== undefined && this.editItem.endDateContract.length != 0)
          return new Date(this.editItem.endDateContract) > new Date(value) ||
          "La fecha de finalización debe ser mayor a la de inicio. ";
          return true;
        }
      ];
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
      if (valid) {
        //passing validations 🚥
        const formData = new FormData();
        let response = {};
        // third fields 🚥
        formData.append("type_document", this.editItem.typeDocument);
        formData.append("identification", this.editItem.identification);
        formData.append("names", this.editItem.names);
        formData.append("surnames", this.editItem.surnames);
        formData.append("address", this.editItem.address);
        formData.append("mobile", this.editItem.mobile);
        formData.append("email", this.editItem.email);
        if (this.editItem.email2 && this.editItem.email2.length > 0)
          formData.append("email2", this.editItem.email2);
        if(this.editItem.postal_code && this.editItem.postal_code.length > 0) formData.append("postal_code", this.editItem.postal_code);
        formData.append("city_id", this.editItem.city.id);

        if (this.editItem.paymentMethods && this.editItem.paymentMethods.length > 0) {

          this.editItem.paymentMethods.forEach((item, i) => {
            formData.append(`payment_methods[${i}][payment_method_id]`, item.id);
            formData.append(`payment_methods[${i}][reference]`, item.reference);
          });
        }
        // employee fields 🚥
        formData.append("type_contract", this.editItem.typeContract);
        formData.append("hire_date", castFullDate(this.editItem.hireDate));
        if(this.editItem.endDateContract && this.editItem.endDateContract.length > 0)
        formData.append(
          "end_date_contract",
          castFullDate(this.editItem.endDateContract)
        );
        formData.append("status", this.editItem.status);
        if (this.editItem.resumeFile && typeof this.resumeFile != "string") {
          formData.append("resume_file", this.editItem.pathResumeFile);
        }
        if (this.editItem.rutFile && typeof this.rutFile != "string") {
          formData.append("rut_file", this.editItem.pathRutFile);
        }

        // services and its fields 🚥
        this.editItem.services.forEach((service, index) => {
          formData.append(`services[${index}][service_id]`, service.id);
          service.fields.forEach((field, findex) => {
            formData.append(
              `services[${index}][fields][${findex}][field_id]`,
              field.id
            );
            if (field.type.id == "F") {
              if (field.data) {
                formData.append(
                  `services[${index}][fields][${findex}][content]`,
                  field.pathFile
                );
              }
            } else {
              formData.append(
                `services[${index}][fields][${findex}][content]`,
                field.data
              );
            }
          });
        });

        if (this.idEditForm) {
          formData.append("employee_id", this.editItem.employeeId);
          response = await employeeApi.update(formData);
        } else {
          response = await employeeApi.create(formData);
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
    async setTypesContract() {
      this.typesContract = (await petition.get("/type-contract-employee")).data;
    },
    async setEditItem() {
      if (!this.idEditForm) {
        this.editItem.services = [];
        this.editItem.paymentMethods = [];

        return;
      }
      const response = await employeeApi.read(`employee_id=${this.idEditForm}`);
      this.editItem = Object.assign(
        {},
        {
          //supplier attributes
          employeeId: response.data.id,
          typeContract: response.data.type_contract.id,
          hireDate: response.data.hire_date.split(" ")[0],
          endDateContract:response.data.end_date_contract ? response.data.end_date_contract.split(" ")[0] : response.data.end_date_contract,
          pathRutFile: response.data.rut_file,
          pathResumeFile: response.data.resume_file,
          status: response.data.status,
          //third attributes
          typeDocument: response.data.third.type_document,
          identification: response.data.third.identification,
          names: response.data.third.names,
          surnames: response.data.third.surnames,
          address: response.data.third.address,
          mobile: response.data.third.mobile,
          email: response.data.third.email,
          email2: response.data.third.email2,
          postal_code: response.data.third.postal_code,
          city: response.data.third.city,
          services: response.data.dynamic_services,
          paymentMethods: response.data.payment_methods || [],
        }
      );

      this.thirdKeyCard = this.thirdKeyCard + 1;
    },
  },
};
</script>
