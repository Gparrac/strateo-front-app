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
            <v-col cols="12" >
              <v-card rounded="true" elevation="0">
                <v-card-text>
                  <v-row>
                        <v-col cols="12" sm="6" md="4">
                          <v-text-field
                            :maxlength="
                              rulesValidation.text.maxLength
                            "
                            label="Nombre"
                            v-model="editItem.name"
                            :rules="rulesValidation.text.rules"
                            :loading="loading"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="4">
                          <v-select
                            label="Estado"
                            v-model="editItem.status"
                            item-title="label"
                            item-value="name"
                            :items="status"
                            :rules="rulesValidation.select.rules"
                            :loading="loading"
                          ></v-select>
                        </v-col>
                    <v-col cols="12" sm="12" md="4">
                      <v-select
                            label="Tipo"
                            v-model="editItem.typeField"
                            item-title="name"
                            :items="typeFields"
                            :return-object="true"
                            :rules="rulesValidation.select.rules"
                            :loading="loading"
                          >
                          <template v-slot:item="{ props, item }">
            <v-list-item v-bind="props">
              <template v-slot:prepend>
                <v-avatar color="grey-lighten-1">
                  <!-- <v-icon color="white">{{item.raw.type.icon}}</v-icon> -->
                  <v-icon color="white">{{ item.raw.icon }}</v-icon>
                </v-avatar>
              </template>
            </v-list-item>
          </template>
                        </v-select>
                    </v-col>

                    <v-col v-if="editItem.typeField && editItem.typeField.id != 'F'" cols="12" sm="6" >
                      <v-text-field
                            label="Tamaño"
                            :maxlength="rulesValidation.quantity.maxLength"
                            v-model="editItem.maxLength"
                            :rules="rulesValidation.quantityNull.rules"
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
import FieldApi from "@/services/Forms/FieldApi.js";
import { RulesValidation } from "@/utils/validations";
import { mapStores } from "pinia";
import { useAlertMessageStore } from "@/store/alertMessage";
import { statusAllowed } from "@/utils/cast";
import Petition from "@/services/PetitionStructure/Petition.js";
const petition = new Petition();

const fieldApi = new FieldApi();


export default {
  props: {
    idEditForm: Number,
    nameTable: String,
    path: String,
  },
  components: {

  },
  data: () => ({
    // required data
    loading: false,
    editItem: {},
    // optional data
    formRef: null,
    status: [],
    typeFields:[],
    rulesValidation: RulesValidation,
  }),
  async mounted() {
    this.loading = true;
    this.status = statusAllowed();
    try {
      await Promise.all([this.setEditItem(), this.setTypeFields()]);
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
    async submitForm() {
      this.loading = true;
      const { valid } = await this.$refs.form.validate();
      if (valid) {
        //passing validations 🚥
        const formData = new FormData();
        let response = {};
        formData.append("name", this.editItem.name);
        formData.append("type", this.editItem.typeField.id);
        if(this.editItem.typeField && this.editItem.typeField.id != 'F') formData.append("length", this.editItem.maxLength);
        formData.append("status", this.editItem.status);

        if (this.idEditForm) {
          formData.append("field_id", this.editItem.serviceId);
          response = await fieldApi.update(formData);
        } else {
          response = await fieldApi.create(formData);
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
    async setTypeFields(){

      this.typeFields = (await petition.get("/type-fields")).data;
    },
    async setEditItem() {
      if (!this.idEditForm) {
        this.editItem.fields = []
       return;
      }

      const response = await fieldApi.read(`field_id=${this.idEditForm}`);
      this.editItem = Object.assign(
        {},
        {
          fieldId: response.data.id,
          name: response.data.name,
          typeField: response.data.type,
          status: response.data.status,
          length: response.data.length
        }
      );
    },
  },
};
</script>
