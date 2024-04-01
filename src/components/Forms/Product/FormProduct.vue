<template>
  <v-form ref="form">
    <v-row justify="center" class="">
      <v-card rounded="3" class="w-100 pa-7" :loading="loading">
        <v-card-title>
          <span class="text-h5">{{ title }} </span>
        </v-card-title>

        <!----------------------- FORM --------------------------->
        <v-card-text>
          <v-row>
            <v-col cols="12">
              <v-card rounded="true" elevation="0">
                <v-card-text>
                  <v-row>
                    <!-- first row -->
                    <v-col v-if="!this.type" cols="12" sm="6" md="4">
                      <v-select
                        label="Tipo de producto"
                        v-model="editItem.type"
                        item-title="name"
                        item-value="id"
                        :items="types"
                        :rules="rulesValidation.select.rules"
                        :loading="loading"
                        @update:model-value="
                          setTypesContent(editItem.type.id, true)
                        "
                        :return-object="true"
                      ></v-select>
                    </v-col>
                    <v-col v-if="editItem.type" cols="12" sm="6" md="4">
                      <v-select
                        label="Tipo de contenido"
                        v-model="editItem.typeContent"
                        item-title="name"
                        :items="typesContent"
                        :rules="rulesValidation.select.rules"
                        :loading="loading"
                        :return-object="true"
                      ></v-select>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        :maxlength="rulesValidation.shortText.maxLength"
                        label="Consecutivo"
                        v-model="editItem.consecutive"
                        :rules="rulesValidation.shortText.rules"
                        :loading="loading"
                      ></v-text-field>
                    </v-col>
                    <!-- second row -->
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        :maxlength="rulesValidation.text.maxLength"
                        label="Nombre"
                        v-model="editItem.name"
                        :rules="rulesValidation.text.rules"
                        :loading="loading"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        :maxlength="rulesValidation.price.maxLength"
                        label="Costo"
                        v-model="editItem.cost"
                        :rules="rulesValidation.price.rules"
                        :loading="loading"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        :maxlength="rulesValidation.shortTextNull.length"
                        label="Codigo de producto"
                        v-model="editItem.productCode"
                        :rules="rulesValidation.shortTextNull.rules"
                        :loading="loading"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        :maxlength="rulesValidation.shortText.length"
                        label="Presentación"
                        v-model="editItem.size"
                        :rules="rulesValidation.shortText.rules"
                        :loading="loading"
                      ></v-text-field>
                    </v-col>
                    <!-- third row -->
                    <v-col cols="12" sm="6" md="4">
                      <v-select
                        label="Medida"
                        v-model="editItem.measure"
                        item-title="name"
                        item-value="id"
                        :items="measures"
                        :rules="rulesValidation.select.rules"
                        :loading="loading"
                      ></v-select>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-select
                        label="Marca"
                        v-model="editItem.brand"
                        item-title="name"
                        item-value="id"
                        :items="brands"
                        :rules="rulesValidation.select.rules"
                        :loading="loading"
                      ></v-select>
                    </v-col>

                    <v-col cols="12" sm="6" md="4">
                      <v-select
                        label="Estado"
                        v-model="editItem.status"
                        item-title="name"
                        item-value="id"
                        :items="status"
                        :rules="rulesValidation.select.rules"
                        :loading="loading"
                      ></v-select>
                    </v-col>

                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        :maxlength="rulesValidation.shortTextNull.length"
                        label="Codigo de barras"
                        v-model="editItem.barcode"
                        :rules="rulesValidation.shortTextNull.rules"
                        :loading="loading"
                      ></v-text-field>
                    </v-col>

                    <v-col cols="12" sm="6" md="4">
                      <v-select
                        label="Categorias"
                        v-model="editItem.categories"
                        item-title="name"
                        item-value="id"
                        multiple
                        :items="categories"
                        :rules="rulesValidation.select.rules"
                        :loading="loading"
                      ></v-select>
                    </v-col>
                    <v-col
                      v-show="editItem.type && editItem.type.id == 'T'"
                      cols="12"
                      md="6"
                    >
                      <v-switch
                        v-model="editItem.tracing"
                        label="Inventario"
                        color="primary"
                      ></v-switch>
                    </v-col>
                    <v-col cols="12">
                      <v-textarea
                        label="Descripción"
                        v-model="editItem.description"
                        :maxLength="rulesValidation.longTextNull.maxLength"
                        :rules="rulesValidation.longTextNull.rules"
                        rows="10"
                        :loading="loading"
                      ></v-textarea>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-col>
            <v-col
                    v-if="
                      editItem.taxes
                    "
                    cols="12"
                    md="6"
                    class="d-flex align-center"
                  >
                    <v-card
                      title="Impuestos"
                      variant="outlined"
                      padding="2"
                      class="w-100 h-100"
                    >
                      <v-card-text>
                        <!------------------------------- DYNAMIC TAXES ITEM --------------------------->
                        <dynamic-tax-list
                          v-if="editItem.taxes"
                          :records="editItem.taxes"
                          context="P"
                          :errorMessage="{}"
                          @update:records="(item) => (editItem.taxes = item)"
                        ></dynamic-tax-list>
                        <!------------------------------- END DYNAMIC TAXES ITEM --------------------------->
                      </v-card-text>
                    </v-card>
                  </v-col>
            <v-col
              v-if="
                editItem.type &&
                editItem.typeContent &&
                editItem.typeContent.id == 'E'
              "
              cols="12"
              md="6"
              class="d-flex align-center"
            >
              <v-card
                title="Subproductos "
                variant="outlined"
                padding="2"
                class="w-100"
              >
                <v-card-text>
                  <!------------------------------- DYNAMIC ITEM --------------------------->
                  <dynamic-product-list
                    :records="editItem.products"
                    @update:records="(item) => (editItem.products = item)"
                  >
                    <v-chip class="ma-2" color="primary" label>
                      <v-icon start :icon="record.type.icon"></v-icon>
                      {{ record.type.name }}
                    </v-chip>
                  </dynamic-product-list>
                  <!------------------------------- END DYNAMIC ITEM --------------------------->

                </v-card-text>
              </v-card>

            </v-col>
            <v-col
            v-if="
                editItem.librettoActivities &&
                editItem.type &&
                editItem.typeContent &&
                editItem.typeContent.id == 'E'
              "
                    cols="12"
                    class="d-flex align-center"
                  >
                    <v-card
                      title="Actividades relacionadas"
                      variant="outlined"
                      padding="2"
                      class="w-100"
                    >
                      <v-card-text>
                        <!------------------------------- DYNAMIC TAXES ITEM --------------------------->
                        <dynamic-libretto-activity-list
                          :records="editItem.librettoActivities"
                          :errorMessage="{}"
                          @update:records="(item) => (editItem.librettoActivities = item)"
                        ></dynamic-libretto-activity-list>
                        <!------------------------------- END DYNAMIC TAXES ITEM --------------------------->
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
            @click="() => $emit('close-form')"
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
import ProductApi from "@/services/Forms/ProductApi.js";
import CategoryApi from "@/services/Forms/CategoryApi.js";
import BrandApi from "@/services/Forms/BrandApi.js";
import MeasureApi from "@/services/Forms/MeasureApi.js";
import { RulesValidation } from "@/utils/validations";
import { mapStores } from "pinia";
import { useAlertMessageStore } from "@/store/alertMessage";
import { statusAllowed } from "@/utils/cast";
//import dynamicFieldList from "@/components/Forms/Service/dynamicFieldList.vue";
import DynamicLibrettoActivityList from "./DynamicLibrettoActivityList.vue";
import DynamicProductList from "./DynamicProductList.vue";
import DynamicTaxList from "@/components/blocks/DynamicTaxList.vue";
import Petition from "@/services/PetitionStructure/Petition";
const productApi = new ProductApi();
const categoryApi = new CategoryApi();
const brandApi = new BrandApi();
const measureApi = new MeasureApi();
const petition = new Petition();

export default {
  props: {
    idEditForm: Number,
    nameTable: String,
    type: {
      type: String,
      required: false,
    },
  },
  components: {
    DynamicProductList,
    DynamicTaxList,
    DynamicLibrettoActivityList
  },
  data: () => ({
    // required data
    loading: false,
    editItem: {},
    // optional data
    formRef: null,
    types: [],
    typesContent: [],
    categories: [],
    brands: [],
    measures: [],
    status: [],
    rulesValidation: RulesValidation,
  }),
  async mounted() {
    this.loading = true;
    this.status = statusAllowed();
    try {
      await Promise.all([
        this.setEditItem(),
        this.setBrands(),
        this.setCategories(),
        this.setMeasures(),
        this.setTypes(),
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
        formData.append("type", this.editItem.type.id);
        formData.append("consecutive", this.editItem.consecutive);
        formData.append("name", this.editItem.name);
        if (this.editItem.description && this.editItem.description.length > 0)
          formData.append("description", this.editItem.description);
        if (this.editItem.productCode)
          formData.append("product_code", this.editItem.productCode);
        formData.append("cost", this.editItem.cost);
        formData.append("brand_id", this.editItem.brand);
        formData.append("measure_id", this.editItem.measure);
        if (this.editItem.barcode)
          formData.append("barcode", this.editItem.barcode);
        formData.append("size", this.editItem.size);
        formData.append("type_content", this.editItem.typeContent.id);
        formData.append("status", this.editItem.status);
        this.editItem.categories.forEach((item, index) => {
          formData.append(`categories_id[${index}]`, item);
        });
        this.editItem.products.forEach((item, index) => {
          formData.append(`products[${index}][product_id]`, item.id);
          formData.append(`products[${index}][amount]`, item.amount);
        });
        this.editItem.taxes.forEach((item, index) => {
          formData.append(`taxes[${index}][tax_id]`, item.id);
          formData.append(`taxes[${index}][percent]`, item.percent);
        });
        this.editItem.librettoActivities.forEach((item, index) => {
          formData.append(`libretto_activity_ids[${index}]`, item.id);
        })
        if (this.editItem.type.id == "T")
          formData.append("tracing", this.editItem.tracing ? 1 : 0);
        if (this.idEditForm) {
          formData.append("product_id", this.editItem.productId);
          response = await productApi.update(formData);
        } else {
          response = await productApi.create(formData);
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
          this.$emit("close-success", { productId: response.product_id });
        }
      }
      this.loading = false;
    },
    async setMeasures() {
      const response = await measureApi.read("format=short");
      if (response.statusResponse == 200) {
        this.measures = response.data;
      }
    },
    async setBrands() {
      const response = await brandApi.read("format=short");
      if (response.statusResponse == 200) {
        this.brands = response.data;
      }
    },
    async setCategories() {
      const response = await categoryApi.read("format=short");
      if (response.statusResponse == 200) {
        this.categories = response.data;
      }
    },
    async setTypes() {
      const response = await petition.get("/type-products", "attribute=type");
      if (response.statusResponse == 200) {
        this.types = response.data;
      }
    },
    async setTypesContent(type, setEditItem = null) {
      if (setEditItem) this.editItem.typeContent = null;
      const response = await petition.get(
        "/type-products",
        `attribute=typeContent&type=${type}`
      );
      if (response.statusResponse == 200) {
        this.typesContent = response.data;
      }
    },
    async setEditItem() {
      if (!this.idEditForm) {
        this.editItem.products = [];
        this.editItem.taxes = [];
        this.editItem.librettoActivities = [];
        if (this.type) {
          this.editItem.type = { id: this.type };
          await this.setTypesContent(this.type, true);
        }
        return;
      }
      const response = await productApi.read(`product_id=${this.idEditForm}`);
      if (response.statusResponse == 200) {
        const data = response.data;
        this.editItem = Object.assign(
          {},
          {
            productId: data.id,
            brand: data.brand.id,
            categories: data.categories.map((item) => item.id),
            consecutive: data.consecutive,
            cost: data.cost,
            description: data.description,
            measure: data.measure.id,
            name: data.name,
            productCode: data.product_code,
            size: data.size,
            status: data.status,
            type: data.type,
            typeContent: data.type_content,
            products: data.subproducts || [],
            barcode: data.barcode,
            tracing: data.tracing ? true : false,
            taxes: data.taxes || [],
            librettoActivities: data.libretto_activities || []
          }
        );
        await this.setTypesContent(this.editItem.type);
      }
    },
  },
};
</script>
