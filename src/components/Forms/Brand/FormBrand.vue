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
              <v-text-field
                label="Nombre"
                v-model="editItem.name"
                :rules="rulesValidation.text.rules"
                :loading="loading"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="4">
              <v-text-field
                maxlength="10"
                label="Código"
                v-model="editItem.code"
                :loading="loading"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="4">
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
import BrandApi from "@/services/Forms/BrandApi.js";
import { RulesValidation } from "@/utils/validations";
import { mapStores } from "pinia";
import { useAlertMessageStore } from "@/store/alertMessage";

const brandApi = new BrandApi();

export default {
  name: "FormBrand",
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
    rulesValidation: RulesValidation,
    status: [
      { name: "A", label: "Activo" },
      { name: "I", label: "Inactivo" },
    ],
  }),
  async mounted() {
    this.loading = true;
    try {
      await Promise.all([
        this.setEditItem(),
      ]);
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
        formData.append("code", this.editItem.code);

        formData.append("status", this.editItem.status);
        
        if (this.idEditForm) {
          formData.append("brand_id", this.editItem.brand_id);
          response = await brandApi.update(formData);
        } else {
          response = await brandApi.create(formData);
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
      const response = await brandApi.read(`brand_id=${this.idEditForm}`);
      if (response.statusResponse != 200) {
        this.editItem = {};
        return;
      }
      this.editItem = Object.assign(
        {},
        {
          brand_id: response.data.id,
          name: response.data.name,
          code: response.data.code,
          status: response.data.status,
        }
      );
    },
  },
};
</script>
