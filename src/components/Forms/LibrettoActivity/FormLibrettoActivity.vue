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
            <v-col cols="12" md="4">
              <v-text-field
                :maxlength="rulesValidation.text.maxLength"
                label="Nombre"
                v-model="editItem.name"
                :rules="rulesValidation.text.rules"
                :loading="loading"
                variant="outlined"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="4">
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
            <v-col cols="12" md="4">
              <file-field
                :item="editItem"
                :loading="loading"
                @update:pathfile="(item) => (editItem.pathFile = item)"
                @update:file="(item) => (editItem.file = item)"
              ></file-field>
            </v-col>
            <v-col cols="12">
              <v-textarea
                label="Descripción"
                v-model="editItem.description"
                :maxLength="rulesValidation.longTextNull.maxLength"
                :rules="rulesValidation.longTextNull.rules"
                rows="4"
                :loading="loading"
                variant="outlined"
              ></v-textarea>
            </v-col>
            <!------------------------------- DYNAMIC ITEM --------------------------->
            <v-col cols="12" class="d-flex align-center">
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
import LibrettoActivityApi from "@/services/Forms/LibrettoActivityApi.js";
import { RulesValidation } from "@/utils/validations";
import { mapStores } from "pinia";
import { useAlertMessageStore } from "@/store/alertMessage";
import DynamicProductList from "@/components/Forms/LibrettoActivity/DynamicProductList.vue";
import FileField from "@/components/blocks/FileField.vue";

const librettoActivityApi = new LibrettoActivityApi();

export default {
  name: "FormCategory",
  props: {
    idEditForm: Number,
    nameTable: String,
    path: String,
  },
  components: {
    DynamicProductList,
    FileField,
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
    thirdKeyCard: 0,
  }),
  async mounted() {
    this.loading = true;
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
      this.loading = true;
      const { valid } = await this.$refs.form.validate();
      if (valid) {
        //passing validations 🚥
        const formData = new FormData();
        let response = {};
        // third fields 🚥
        formData.append("name", this.editItem.name);
        formData.append("description", this.editItem.description);
        formData.append("status", this.editItem.status);
        if (
          this.editItem.pathFile &&
          typeof this.editItem.pathFile != "string"
        ) {
          formData.append("file", this.editItem.pathFile);
        }
        this.editItem.products.forEach((item, index) => {
          formData.append(`product_ids[${index}]`, item.id);
        });

        if (this.idEditForm) {
          formData.append(
            "libretto_activity_id",
            this.editItem.libretto_activity_id
          );
          response = await librettoActivityApi.update(formData);
        } else {
          response = await librettoActivityApi.create(formData);
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
    handleFileCommercialChange(event) {
      const files = event.target.files;
      if (files.length > 0) {
        const selectedFile = files[0];
        this.showFileCommercialSelected = selectedFile;
      }
    },
    async setEditItem() {
      if (!this.idEditForm) {
        this.editItem.products = [];
        return;
      }
      const response = await librettoActivityApi.read(
        `libretto_activity_id=${this.idEditForm}`
      );
      if (response.statusResponse != 200) {
        this.editItem = {};
        return;
      }
      this.editItem = Object.assign(
        {},
        {
          //category attributes
          libretto_activity_id: response.data.id,
          name: response.data.name,
          description: response.data.description,
          pathFile: response.data.path_file,
          status: response.data.status,

          // products attributes
          products: response.data.products ?? [],
        }
      );

      this.thirdKeyCard = this.thirdKeyCard + 1;
    },
  },
};
</script>
