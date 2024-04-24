<template>
  <div>
    <v-btn @click="active = true"   icon="mdi-plus"  variant="tonal" color="primary">
    </v-btn>

    <v-dialog  v-model="active" :close-on-back="true" style="width: 450px;">
      <v-card class="px-7 pt-4">
        <v-form ref="formTaxValue">
        <v-row justify="center">
          <v-col cols="12">
            <v-text-field
                variant="outlined"
                :maxlength="rulesValidation.percent.maxLength"
                label="Porcentaje"
                v-model="percent"
                :rules="rulesValidation.percent.rules"
                :loading="loading"

              ></v-text-field>

          </v-col>
        </v-row>

      </v-form>

          <div class="pt-2">
        <small
          v-for="(error, index) in alertMessageStore.listErrors"
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
            @click="() => active = false"
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
    </v-dialog>

  </div>
</template>
<script>
import TaxValueApi from "@/services/Forms/TaxValueApi";
import { useAlertMessageStore } from "@/store/alertMessage";
import { RulesValidation } from "@/utils/validations";
import { mapStores } from 'pinia';
const taxValueApi = new TaxValueApi();
export default {

  data: () => ({
    active:false,
    percent:null,
    rulesValidation: RulesValidation,
    loading: false
  }),

  created() {
  },
  computed: {
    ...mapStores(useAlertMessageStore),
  },
  methods:{
    async submitForm(){
      this.loading = true;
      const { valid } = await this.$refs.formTaxValue.validate();
      if (valid) {
        //passing validations 🚥
        const formData = new FormData();
        let response = {};
        formData.append("percent", this.percent);

          response = await taxValueApi.create(formData);

        // logic to show alert 🚨
        if (response.statusResponse != 200) {
          if(response.error && typeof response.error === 'object'){
            this.alertMessageStore.show(false, "Error en la solicitud.",response.error);
          }else{
            this.alertMessageStore.show(false, "Error en el servidor.");
          }
        } else {
          this.alertMessageStore.show(true, "Proceso exitoso!");
          this.active = false;
          this.$emit('new-value', response.data);
        }

      }
      this.loading = false;
    }
  },

};
</script>
