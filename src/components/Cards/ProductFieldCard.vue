<template>
  <v-row>
    <v-col cols="12">
      <v-card rounded="true" elevation="0">
        <v-card-text>
          <v-row>
            <v-col cols="12" sm="8" lg="8">
              <v-row>
                <!-- first row -->
                <v-col cols="12" sm="6" md="4">
                  <v-select
                    label="Tipo de producto"
                    :model-value="editItem.type"
                    item-title="name"
                    item-value="id"
                    :items="types"
                    :rules="rulesValidation.select.rules"
                    :loading="loading"
                    @update:model-value="changeType"
                    :return-object="true"
                  ></v-select>
                </v-col>
                <v-col v-if="editItem.type" cols="12" sm="6" md="4">
                  <v-select
                    label="Tipo de contenido"
                    item-title="name"
                    :items="typesContent"
                    :rules="rulesValidation.select.rules"
                    :loading="loading"
                    :return-object="true"
                    :model-value="editItem.typeContent"
                    @update:model-value="(value) => emitRecords(value, 'typeContent')"
                  ></v-select>
                </v-col>
                <v-col cols="12" sm="6" md="4">
                  <v-text-field
                    :maxlength="rulesValidation.shortText.maxLength"
                    label="Consecutivo"
                    :model-value="editItem.consecutive"
            @update:model-value="(value) => emitRecords(value, 'consecutive')"
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
                    :model-value="editItem.name"
            @update:model-value="(value) => emitRecords(value, 'name')"
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
                <v-col
                  v-show="editItem.type && editItem.type.id == 'T'"
                  cols="12"
                  sm="6"
                  md="4"
                >
                  <v-switch
                    v-model="editItem.tracing"
                    label="Inventario"
                    :color="tracing ? 'orange' : 'primary'"
                  ></v-switch>
                </v-col>
              </v-row>
            </v-col>
            <v-col cols="12" sm="4">
              <v-row>
                <v-col cols="12">
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
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-col>
    <v-col
      v-if="
        editItem.type && editItem.typeContent && editItem.typeContent.id == 'E'
      "
      cols="12"
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
    <v-col cols="12"> </v-col>
  </v-row>
</template>
<script>
import ProductApi from "@/services/Forms/ProductApi.js";
import CategoryApi from "@/services/Forms/CategoryApi.js";
import BrandApi from "@/services/Forms/BrandApi.js";
import MeasureApi from "@/services/Forms/MeasureApi.js";
import Petition from "@/services/PetitionStructure/Petition";
import { RulesValidation } from '@/utils/validations';
const productApi = new ProductApi();
const categoryApi = new CategoryApi();
const brandApi = new BrandApi();
const measureApi = new MeasureApi();
const petition = new Petition();
export default {
  props: {
    editItem: Object,
  },
  data: () => ({
    types: [],
    typesContent: [],
    categories: [],
    brands: [],
    measures: [],
    status: [],
    rulesValidation: RulesValidation
  }),
  async mounted() {
    this.loading = true;
    this.status = this.statusAllowed();
    try {
      await Promise.all([
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
  methods: {
    async changeType(value){
      await this.setTypesContent(value, true);
      this.emitRecords(value, 'type')
    },
    emitRecords(item, key) {
      this.$emit("update:records", { item: item, key: key });
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
    async setProducts() {
      const response = await productApi.read("format=short");
      if (response.statusResponse == 200) {
        this.products = response.data;
      }
    },
  },
};
</script>
