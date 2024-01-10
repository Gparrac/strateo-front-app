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
                        label="Comercio"
                        v-model="editItem.business"
                        item-title="label"
                        item-value="name"
                        :items="businesses"
                        :rules="rulesValidation.select.rules"
                        :loading="loading"
                      ></v-select>
                    </v-col>
                    <v-col cols="12" sm="4">
                      <v-select
                        label="Tienda"
                        v-model="editItem.shop"
                        item-title="label"
                        item-value="name"
                        :items="shops"
                        :rules="rulesValidation.select.rules"
                        :loading="loading"
                      ></v-select>
                    </v-col>

                    <v-col cols="12" sm="4" >
                      <v-select
                        label="Consecutivo"
                        v-model="editItem.consecutive"
                        item-title="label"
                        item-value="name"
                        :items="consecutive"
                        :rules="rulesValidation.select.rules"
                        :loading="loading"
                      ></v-select>
                    </v-col>
                    <v-col cols="12" sm="4">
                      <v-text-field
                        type="date"
                        label="Fecha de ingreso"
                        v-model="editItem.date"
                        :rules="rulesValidation.text.rules"
                        :loading="loading"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="4">
                      <v-text-field
                        label="Provedor"
                        :maxlength="rulesValidation.text.maxLength"
                        v-model="editItem.supplier"
                        :rules="rulesValidation.text.rules"
                        :loading="loading"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="4">
                      <v-select
                        label="Documento"
                        v-model="editItem.identification"
                        item-title="label"
                        item-value="name"
                        :items="identifications"
                        :rules="rulesValidation.select.rules"
                        :loading="loading"
                      ></v-select>
                    </v-col>
                    <v-col cols="12" sm="4">
                      <v-text-field
                      :maxlength="rulesValidation.text.maxLength"
                        label="Número de factura"
                        v-model="editItem.billNumber"
                        :rules="rulesValidation.text.rules"
                        :loading="loading"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="4">
                      <v-select
                        label="Tipo de entrada"
                        v-model="editItem.entryTypes"
                        item-title="label"
                        item-value="name"
                        :items="entryTypes"
                        :rules="rulesValidation.select.rules"
                        :loading="loading"
                      ></v-select>
                    </v-col>
                    <v-col cols="12" sm="4">
                      <v-select
                        label="Estado"
                        v-model="editItem.state"
                        item-title="label"
                        item-value="name"
                        :items="states"
                        :rules="rulesValidation.select.rules"
                        :loading="loading"
                      ></v-select>
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
                  <TableProduct @set-items="setSelectProducts"/>
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
import { mapStores } from "pinia";
import { useAlertMessageStore } from "@/store/alertMessage";
import TableProduct  from "./TableProduct.vue"

const enterpriseApi = new EnterpriseApi();
const petition = new Petition();

export default {
  props: {
    nameTable: String,
    path: String,
  },
  components: {
    TableProduct
  },
  data: () => ({
    // required data
    loading: false,
    editItem: {},
    // optional data
    states: [],
    entryTypes: [],
    business: [],
    shops: [],
    ciiuCodes: [],
    consecutive: [],
    identifications:[],
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
        this.setTypesDocument(),

      ]);
    } catch (error) {
      console.error("Alguna de las funciones falló:", error);
    }
    this.loading = false;
  },
  computed: {
    ...mapStores(useAlertMessageStore),
  },
  methods: {
    setSelectProducts(data){
      console.log('cambiando',data.items)
    },
    async submitForm() {
      this.loading = true;
      const { valid } = await this.$refs.form.validate();
      if (valid) {
        //passing validations 🚥
        const formData = new FormData();
        let response = {};
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
        }
      );

    },
    async setCities(name = null) {
      const query = name ? `?name=${name}` : "";
      this.cities = (await petition.get("/cities", query)).data;
    },

    async setTypesDocument() {
      this.typesDocument = (await petition.get("/type-document-user")).data;
    },




  },
};
</script>
