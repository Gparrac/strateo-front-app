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
            <v-col cols="12" sm="6" lg="4">
              <v-text-field
                :maxlength="rulesValidation.text.maxLength"
                label="Nombre"
                v-model="editItem.name"
                :rules="rulesValidation.text.rules"
                :loading="loading"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6" lg="4">
              <v-text-field
                :maxlength="5"
                label="Acrónimo"
                v-model="editItem.acronym"
                :rules="rulesValidation.text.rules"
                :loading="loading"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6" lg="4">
              <v-select
              multiple
                return-object
                :items="taxValues"
                label="Porcentajes validos"
                item-title="percent"
                v-model="editItem.taxValues"
                :rules="rulesValidation.select.rules"
                :loading="loading"
                prepend-inner-icon="mdi-percent"
              >
            <template v-slot:append>
                  <modal-new-tax-value @new-value="updateTaxValues"></modal-new-tax-value>
            </template>
            </v-select>

            </v-col>
            <v-col cols="12" sm="6" lg="4">
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
            <v-col cols="12" sm="6" lg="4">
              <v-select

                label="Contexto"
                :items="contexts"
                v-model="editItem.context"
                item-title="label"
                item-value="name"
                :rules="rulesValidation.select.rules"
                :loading="loading"

              ></v-select>
            </v-col>
            <v-col cols="12" sm="6" lg="4">
              <v-select
                label="Tipo"
                :items="types"
                v-model="editItem.type"
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
import TaxApi from "@/services/Forms/TaxApi.js";
import { RulesValidation } from "@/utils/validations";
import { mapStores } from "pinia";
import { useAlertMessageStore } from "@/store/alertMessage";
import ModalNewTaxValue from "./ModalNewTaxValue.vue";
import TaxValueApi from "@/services/Forms/TaxValueApi";


const taxApi = new TaxApi();
const taxValueApi = new TaxValueApi();

export default {
  name: "FormTax",
  props: {
    idEditForm: Number,
    nameTable: String,
    path: String,
  },
  components: {
    ModalNewTaxValue
  },
  data: () => ({
    // required data
    loading: false,
    editItem: {taxValues:[]},
    // optional data
    rulesValidation: RulesValidation,
    status: [
      { name: "A", label: "Activo" },
      { name: "I", label: "Inactivo" },
    ],
    types: [
      { name: "D", label: "Decremento" },
      { name: "I", label: "Incremento" },
    ],
    contexts: [
      { name: "P", label: "Por producto o servicio" },
      { name: "I", label: "Por venta" },
    ],
    taxValues:[]
  }),
  async mounted() {
    this.loading = true;
    try {
      await Promise.all([this.setEditItem(), this.setTaxValues()]);
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
    updateTaxValues(item){
      (this.editItem.taxValues) ? this.editItem.taxValues.push(item) : this.editItem.taxValues = [item];
      this.taxValues.push(item);
    },
    async submitForm() {
      this.loading = true;
      const { valid } = await this.$refs.form.validate();
      if (valid) {
        //passing validations 🚥
        const formData = new FormData();
        let response = {};
        formData.append("name", this.editItem.name);
        formData.append("acronym", this.editItem.acronym);
        formData.append("default_percent", this.editItem.default_percent);
        formData.append("status", this.editItem.status);
        formData.append("context", this.editItem.context);
        formData.append("type", this.editItem.type);
        this.editItem.taxValues.forEach((item, i)=> {
          formData.append(`values[${i}][tax_value_id]`, item.id);
          formData.append(`values[${i}][percent]`, item.percent);
        });
        if (this.idEditForm) {
          formData.append("tax_id", this.editItem.tax_id);
          response = await taxApi.update(formData);
        } else {
          response = await taxApi.create(formData);
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
    async setTaxValues(){
      const response = await taxValueApi.read();
      this.taxValues = response.data;
    },
    async setEditItem() {
      if (!this.idEditForm) return;
      const response = await taxApi.read(`tax_id=${this.idEditForm}`);
      if (response.statusResponse != 200) {
        this.editItem = {};
        return;
      }
      this.editItem = Object.assign(
        {},
        {
          tax_id: response.data.id,
          name: response.data.name,
          acronym: response.data.acronym,
          default_percent: response.data.default_percent,
          status: response.data.status,
          type: response.data.type,
          context:response.data.context,
          taxValues: response.data.tax_values
        }
      );
    },
  },
};
</script>
