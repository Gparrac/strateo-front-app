<template>
  <div class="pa-4 text-center">
    <v-dialog :model-value="toggle" max-width="600" persistent >
      <v-card prepend-icon="mdi-cash-refund" :title="idEditForm ? `Actualización del cargo ${idEditForm}`: `Creación del cargo`">
        <v-card-text>
          <v-form ref="formPaymentMethod">
            <v-row>
              <v-col cols="12" md="8">
                <v-text-field
                  :maxlength="rulesValidation.text.maxLength"
                  label="Nombre"
                 :model-value="editItem.name"
                 v-on:update:model-value="(item) => $emit('update-attribute', {key: 'name', item: item})"
                  :rules="rulesValidation.text.rules"
                  :loading="loading"
                  variant="outlined"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="4">
                          <v-select
                            label="Estado"
                            :items="status"
                            :model-value="editItem.status"
                            v-on:update:model-value="(item) => $emit('update-attribute', {key: 'status', item: item})"
                            item-title="label"
                            item-value="name"
                            :rules="rulesValidation.select.rules"
                            :loading="loading"
                            variant="outlined"
                          ></v-select>
                        </v-col>
              <v-col cols="12">
                <v-textarea
                  label="Descripción"
                  :model-value="editItem.description"
                  v-on:update:model-value="(item) => $emit('update-attribute', {key: 'description', item: item})"
                  :maxLength="rulesValidation.longTextNull.maxLength"
                  :rules="rulesValidation.longTextNull.rules"
                  :loading="loading"
                  variant="outlined"
                ></v-textarea>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn
            text="Cerrar"
            variant="plain"
            @click="$emit('update-toggle', false)"
          ></v-btn>

          <v-btn
            color="primary"
            text="Guardar"
            variant="tonal"
            @click="saveRecord"
          ></v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import { RulesValidation } from "@/utils/validations";
import { mapStores } from "pinia";
import { useAlertMessageStore } from "@/store/alertMessage";
import ChargeApi from "@/services/Forms/ChargeApi";
import { statusAllowed } from "@/utils/cast";
const chargeApi = new ChargeApi();

export default {
  props: {
    toggle: Boolean,
    idEditForm: Number,
    editItem: Object
  },
  components: {},
  data: () => ({
    // required data
    loading: false,
    // optional data
    rulesValidation: RulesValidation,
    status: [],
  }),
  mounted(){
    this.status = statusAllowed();
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
    async saveRecord() {
      // return
      this.loading = true;
      const { valid } = await this.$refs.formPaymentMethod.validate();
      if (valid) {
        //passing validations 🚥
        const formData = new FormData();
        let response = {};

        // third fields 🚥
        formData.append("name", this.editItem.name);
        formData.append("description", this.editItem.description);
        formData.append("status", this.editItem.status);
        if (this.editItem.id) {
          formData.append("charge_id", this.editItem.id);
          response = await chargeApi.update(formData);
        } else {
          response = await chargeApi.create(formData);
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
          this.$emit('update-toggle', false)
          this.$emit('record-saved');
        }
      }
      this.loading = false;
    },
  },
};
</script>
