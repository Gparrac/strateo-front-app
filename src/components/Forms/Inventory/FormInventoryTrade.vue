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
                        :disabled="!this.editDisable"
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
                        :disabled="!this.editDisable"
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
                    <v-col cols="12">
                      <v-textarea
                        label="Observaciones"
                        v-model="editItem.note"
                        :maxLength="rulesValidation.longTextNull.maxLength"
                        :rules="rulesValidation.longTextNull.rules"
                        :loading="loading"
                        rows="2"
                      ></v-textarea>
                    </v-col>
                    <v-col cols="12" sm="4">
                      <v-autocomplete
                        label="Bodega"
                        v-model="editItem.warehouse"
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
                              <span class="d-block">{{
                                item.raw.city.name
                              }}</span>
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
                      <h3 class="text-h3 font-weight-light text-right">
                        {{ totalCost }}
                      </h3>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-col>
            <v-col cols="12" lg="12">
              <v-card
              v-if="editItem.products && editItem.warehouse && editItem.type"
                title="Productos relacionados"
                variant="outlined"
                padding="2"
              >
                <v-card-text>
                  <DynamicProductList
                    :typeTransaction=" editItem.type"
                    :records="editItem.products"
                    :error-message="customAlertError"
                    :editable="idEditForm"
                    :warehouse="editItem.warehouse.id ?? null"
                    @update:records="(item) => (editItem.products = item)"
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
import WarehouseApi from "@/services/Forms/WarehouseApi.js";
import SupplierApi from "@/services/Forms/SupplierApi.js";
import InventoryApi from "@/services/Forms/InventoryApi.js";
import { RulesValidation } from "@/utils/validations";
import { mapStores } from "pinia";
import { useAlertMessageStore } from "@/store/alertMessage";
import DynamicProductList from "./DynamicProductList.vue";
import Petition from "@/services/PetitionStructure/Petition";
import { castFullDate } from '@/utils/cast';

const inventoryApi = new InventoryApi();
const warehouseApi = new WarehouseApi();
const supplierApi = new SupplierApi();
const petition = new Petition();

export default {
  props: {
    nameTable: String,
    path: String,
    idEditForm: Number,
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
    types: [],
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
        this.setPurposes(),
        this.setTypesTride(),
      ]);
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
      const total = this.editItem.products
        ? this.editItem.products
            .map((item) => (item.cost ?? 0) * (item.amount ?? 0))
            .reduce((total, unitCost) => total + unitCost, 0)
        : 0;
      return total;
    },
    editDisable(){
      return this.idEditForm ? false: true;
    }
  },
  methods: {
    async submitForm() {
      this.loading = true;
      if (this.isEditForm && (!this.editItem.products || this.editItem.products.length == 0)) {
            this.customAlertError.type = "products";
            this.customAlertError.message =
              "Debes seleccionar almenos un producto";
          } else {
            this.customAlertError = {};
          }

      const { valid } = await this.$refs.form.validate();
      if (valid) {
        //passing validations 🚥
        const formData = new FormData();
        if (this.editItem.note) formData.append("note", this.editItem.note);
        formData.append("supplier_id", this.editItem.supplier.id);
        formData.append("date", castFullDate(this.editItem.date) );
        let response = {};
        if (this.isEditForm) {
          formData.append("inventory_trade_id", this.editItem.inventoryTradeId);
          response = await inventoryApi.update(formData);
        } else {
          //validate selected products

          formData.append("transaction_type", this.editItem.type);
          formData.append("purpose", this.editItem.purpose);
          formData.append("warehouse_id", this.editItem.warehouse.id);
          this.editItem.products.forEach((item, pindex) => {
            formData.append(`products[${pindex}][product_id]`, item.id);
            formData.append(`products[${pindex}][cost]`, item.cost);
            formData.append(`products[${pindex}][amount]`, item.amount);
          });
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
      if (!this.idEditForm) {
        this.editItem.products = [];
        return;
      }
      const response = await inventoryApi.read(
        `inventory_trade_id=${this.idEditForm}`
      );
      if (response.statusResponse != 200) {
        this.editItem = {};
        return;
      }
      const data = response.data;
      this.isEditForm = true;
      this.editItem = Object.assign(
        {},
        {
          inventoryTradeId: data.id,
          purpose: data.purpose.id,
          type: data.transaction_type.id,
          supplier: data.supplier,
          warehouse: data.warehouse,
          date: data.transaction_date,
          note: data.note,
          products: data.inventories.map((item) => item.product),
        }
      );
    },
    async setTypesTride() {
      this.types = (
        await petition.get("/type-inventory-trades", `attribute=type`)
      ).data;
    },
    async setPurposes() {
      this.purposes = (
        await petition.get(
          "/type-inventory-trades",
          `attribute=purpose&type=${this.editItem.type}`
        )
      ).data;
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
