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
                    <v-col cols="12" sm="6">
                      <v-row>
                        <v-col cols="12">
                          <v-text-field
                            :maxlength="rulesValidation.text.maxLength"
                            label="Nombre"
                            v-model="editItem.name"
                            :rules="rulesValidation.text.rules"
                            :loading="loading"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12">
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
                      </v-row>
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-textarea
                        label="Descripción"
                        v-model="editItem.description"
                        :maxLength="rulesValidation.longText.maxLength"
                        :rules="rulesValidation.longText.rules"
                        :loading="loading"
                      ></v-textarea>
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
                    v-if="editItem.fields"
                    :records="editItem.fields"
                    @update:records="(item) => (editItem.fields = item)"
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
import ServiceApi from "@/services/Forms/ServiceApi.js";
import { RulesValidation } from "@/utils/validations";
import { mapStores } from "pinia";
import { useAlertMessageStore } from "@/store/alertMessage";
import { statusAllowed } from "@/utils/cast";
//import dynamicFieldList from "@/components/Forms/Service/dynamicFieldList.vue";
import DynamicFieldList from "@/components/Forms/Service/DynamicFieldList.vue";
const serviceApi = new ServiceApi();

export default {
  props: {
    idEditForm: Number,
    nameTable: String,
    path: String,
  },
  components: {
    DynamicFieldList,
  },
  data: () => ({
    // required data
    loading: false,
    editItem: {},
    // optional data
    formRef: null,
    status: [],
    rulesValidation: RulesValidation,
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
    async submitForm() {
      console.log("return", this.editItem.fields);
      this.loading = true;
      const { valid } = await this.$refs.form.validate();
      if (valid) {
        //passing validations 🚥
        const formData = new FormData();
        let response = {};
        formData.append("name", this.editItem.name);
        formData.append("status", this.editItem.status);
        formData.append("description", this.editItem.description);
        this.editItem.fields.forEach((item, index) => {
          formData.append(`fields[${index}][field_id]`, item.id);
          formData.append(`fields[${index}][required]`, item.required ? 1 : 2);
        });

        if (this.idEditForm) {
          formData.append("service_id", this.editItem.serviceId);
          response = await serviceApi.update(formData);
        } else {
          response = await serviceApi.create(formData);
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
      if (!this.idEditForm) {
        this.editItem.fields = [];
        return;
      }
      const response = await serviceApi.read(`?service_id=${this.idEditForm}`);
      this.editItem = Object.assign(
        {},
        {
          serviceId: response.data.id,
          name: response.data.name,
          description: response.data.description,
          status: response.data.status,
          fields: response.data.fields.map((item) => ({
            id: item.id,
            name: item.name,
            required: item.pivot.required == 1 ? true : false,
            type: item.type,
            length: item.length,
          })),
        }
      );
    },
  },
};
</script>
