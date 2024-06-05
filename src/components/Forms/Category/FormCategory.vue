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
              <v-text-field
              variant="outlined"
              :maxlength="rulesValidation.text.maxLength" label="Nombre" v-model="editItem.name"
                  :rules="rulesValidation.text.rules" :loading="loading"></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field
              variant="outlined"
              :maxlength="rulesValidation.text.maxLength" label="Código" v-model="editItem.code"
                  :rules="rulesValidation.text.rules" :loading="loading"></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-select
              variant="outlined"
                label="Estado"
                :items="status"
                v-model="editItem.status"
                item-title="label"
                item-value="name"
                :rules="rulesValidation.select.rules"
                :loading="loading"
              ></v-select>
            </v-col>
            <!------------------------------- DYNAMIC ITEM --------------------------->
            <v-col
              cols="12"
              class="d-flex align-center"
            >
              <v-card
                title="Productos "
                variant="outlined"
                padding="2"
                class="w-100"
              >
                <v-card-text>
                  <dynamic-product-list
                    :records="editItem.products ?? []"
                    @update:records="(item) => (editItem.products = item)"
                  >
                    <v-chip class="ma-2" color="primary" label>
                      <v-icon start :icon="record.type.icon"></v-icon>
                      {{ record.type.name }}
                    </v-chip>
                  </dynamic-product-list>
                </v-card-text>
              </v-card>
            </v-col>
            <!------------------------------- END DYNAMIC ITEM --------------------------->
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
import CategoryApi from "@/services/Forms/CategoryApi.js";
import { RulesValidation } from "@/utils/validations";
import { mapStores } from "pinia";
import { useAlertMessageStore } from "@/store/alertMessage";
import DynamicProductList from "@/components/Forms/Category/DynamicProductList.vue"

const categoryApi = new CategoryApi();

export default {
  name: "FormCategory",
  props: {
    idEditForm: Number,
    nameTable: String,
    path: String,
  },
  components: {
    DynamicProductList
  },
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
    thirdKeyCard:0,
    cities: [],
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
        // third fields 🚥
        formData.append("name", this.editItem.name);
        formData.append("code", this.editItem.code);
        formData.append("status", this.editItem.status);

        this.editItem.products.forEach((item, index) => {
          formData.append(`products_ids[${index}]`, item.id);
        });

        if (this.idEditForm) {
          formData.append("category_id", this.editItem.category_id);
          response = await categoryApi.update(formData);
        } else {
          response = await categoryApi.create(formData);
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
      const response = await categoryApi.read(`category_id=${this.idEditForm}`);
      if (response.statusResponse != 200) {
        this.editItem = {};
        return;
      }
      this.editItem = Object.assign(
        {},
        {
          //category attributes
          category_id: response.data.id,
          name: response.data.name,
          code: response.data.code,
          status: response.data.status,

          // products attributes
          products: response.data.products ?? []
        }
      );

      this.thirdKeyCard = this.thirdKeyCard + 1 ;

    },
  },
};
</script>
