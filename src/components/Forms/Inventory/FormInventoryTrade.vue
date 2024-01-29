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
                        label="Tipo "
                        v-model="editItem.type"
                        item-title="name"
                        item-value="id"
                        :items="types"
                        :rules="rulesValidation.select.rules"
                        @update:modelValue="setPurposes"
                        :loading="loading"
                      ></v-select>
                    </v-col>
                    <v-col cols="12" sm="4">
                      <v-select
                        label="Proposito"
                        v-model="editItem.purpose"
                        item-title="name"
                        item-value="id"
                        :items="purposes"
                        :rules="rulesValidation.select.rules"
                        :loading="loading"
                      ></v-select>
                    </v-col>
                    <v-col cols="12" sm="4">
                      <v-autocomplete
                        label="Provedor"
                        v-model="editItem.supplier"
                        v-model:search="searchSupplier"
                        item-title="supplier"
                        :return-object="true"
                        :items="suppliers"
                        :rules="rulesValidation.select.rules"
                        :loading="loading"
                      >
                        <template v-slot:item="{ props, item }">
                          <v-list-item v-bind="props">
                            <v-list-item-subtitle class="d-flex">
                              <span class="d-block">{{
                                item.raw.commercial_registry
                              }}</span>
                            </v-list-item-subtitle>
                          </v-list-item>
                        </template>
                      </v-autocomplete>
                    </v-col>
                    <v-col cols="12" sm="4">
                      <v-autocomplete
                        label="Bodega"
                        v-model="editItem.warehouses"
                        v-model:search="searchWarehouse"
                        item-title="address"
                        :return-object="true"
                        :items="warehouses"
                        :rules="rulesValidation.select.rules"
                        :loading="loading"
                      >
                        <template v-slot:item="{ props, item }">
                          <v-list-item v-bind="props">
                            <v-list-item-subtitle class="d-flex">
                              <span class="d-block">{{ item.raw.city.name }}</span>
                            </v-list-item-subtitle>
                          </v-list-item>
                        </template>
                      </v-autocomplete>
                    </v-col>
                    <v-col cols="12" sm="4">
                      <v-text-field
                        type="datetime-local"
                        v-model="editItem.date"
                        label="Fecha y Hora"
                        :rules="rulesValidation.date.rules"
                      ></v-text-field>
                    </v-col>

                    <v-col cols="12" sm="4">
                      <h4 class="text-subtitle-2">Valor total</h4>
                      <h3 class="text-h3 font-weight-light text-right">{{ totalCost }}</h3>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-col>
            <v-col cols="12" lg="12">
              <v-card
                title="Productos relacionados"
                variant="outlined"
                padding="2"
              >
                <v-card-text>
                  <DynamicProductList
                    v-if="editItem.products"
                    :records="editItem.products"
                    :error-message="customAlertError"
                    @update:records = "(item) => (editItem.products = item)"
                  />
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
import WarehouseApi from "@/services/Forms/WarehouseApi.js";
import SupplierApi from "@/services/Forms/SupplierApi.js";
import InventoryApi from "@/services/Forms/InventoryApi.js";
import { RulesValidation } from "@/utils/validations";
import { mapStores } from "pinia";
import { useAlertMessageStore } from "@/store/alertMessage";
import DynamicProductList from "./DynamicProductList.vue";

const inventoryApi = new InventoryApi();
const warehouseApi = new WarehouseApi();
const supplierApi = new SupplierApi();

export default {
  props: {
    nameTable: String,
    path: String,
  },
  components: {
    DynamicProductList,
  },
  data: () => ({
    // required data
    loading: false,
    editItem: {},
    // optional data
    states: [],
    types: [
      { id: "E", name: "Entrada" },
      { id: "D", name: "Salida" },
    ],
    purposes: [],
    products: [],
    suppliers: [],
    warehouses: [],
    searchWarehouse: "",
    searchSupplier: "",
    rulesValidation: RulesValidation,
    customAlertError: {},

    isEditForm: false,
  }),
  async mounted() {
    this.loading = true;
    try {
      await Promise.all([
        this.setEditItem(),
        this.setSuppliers(),
        this.setWarehouses(),
      ]);
      console.log("entando",this.editItem.products)
    } catch (error) {
      console.error("Alguna de las funciones falló:", error);
    }
    this.loading = false;
  },
  watch: {
    async searchWarehouse(to) {
      if (to.length > 3 && to.length < 5) {
        this.setWarehouses(to);
      }
    },
    async searchSupplier(to) {
      if (to.length > 3 && to.length < 5) {
        this.setSuppliers(to);
      }
    },
  },
  computed: {
    ...mapStores(useAlertMessageStore),
    totalCost() {
      return 0;
    },
  },
  methods: {
    async submitForm() {
      this.loading = true;
      const { valid } = await this.$refs.form.validate();
      if (valid) {
        //passing validations 🚥
        const formData = new FormData();
        let response = {};
        if (this.isEditForm) {
          response = await inventoryApi.update(formData);
        } else {
          response = await inventoryApi.create(formData);
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
      console.log('entrando')
      if (!this.idEditForm) {
        this.editItem.products = [];
        return;
      }
      const response = await inventoryApi.read();
      if (response.statusResponse != 200) {
        this.editItem = {};
        return;
      }
      this.isEditForm = true;
      this.editItem = Object.assign({}, {});
    },
    setPurposes() {
      console.log("entrando purposes");
      if (this.editItem.type == "E") {
        this.purposes = [
          { id: "IB", name: "Saldo inicial" },
          { id: "D", name: "Donación" },
          { id: "A", name: "Ajuste" },
        ];
      } else {
        this.purposes = [
          { id: "S", name: "Venta" },
          { id: "A", name: "Ajuste" },
        ];
      }
    },
    async setWarehouses(name = null) {
      const query = name ? `&name=${name}` : "";
      this.warehouses = (await warehouseApi.read(`format=short&${query}`)).data;
    },

    async setSuppliers(name = null) {
      const query = name ? `&name=${name}` : "";
      this.suppliers = (await supplierApi.read(`format=short&${query}`)).data;
    },
  },
};
</script>
