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
              <v-card rounded="true" elevation="0">
                <v-card-text>
                  <v-row>
                    <v-col cols="12" sm="4">
                      <v-text-field
                        type="datetime-local"
                        variant="outlined"
                        label="Fecha y hora"
                        v-model="editItem.date"
                        :rules="rulesValidation.date.rules"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="4">
                      <dynamic-select-field
                        :options="suppliers"
                        :itemSaved="editItem.supplier"
                        @update:options="setSuppliers"
                        @update:itemSelected="
                          (item) => (editItem.supplier = item)
                        "
                        mainLabel="supplier"
                        :secondLabel="['commercial_registry']"
                        title="Provedor"
                        :rules="rulesValidation.select.rules"
                      >
                      </dynamic-select-field>
                    </v-col>
                    <v-col cols="12" sm="4">
                      <v-select
                        label="Estado"
                        :items="status"
                        v-model="editItem.status"
                        item-title="label"
                        item-value="name"
                        variant="outlined"
                        :rules="rulesValidation.select.rules"
                        :loading="loading"
                      ></v-select>
                    </v-col>
                    <v-col cols="12" sm="12">
                      <v-textarea
                        label="Observaciones"
                        variant="outlined"
                        :maxLength="rulesValidation.longTextNull.maxLength"
                        :rules="rulesValidation.longTextNull.rules"
                        v-model="editItem.note"
                        :loading="loading"
                        rows="2"
                      ></v-textarea>
                    </v-col>
                  </v-row>
                  <dynamic-product-list
                :records="editItem.products"
                :editable="editable"
                :errorMessage="errorMessage"
                @update:records="(item) => editItem.products = item"
              ></dynamic-product-list>
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
import PurchaseOrderApi from "@/services/Forms/PurchaseOrderApi.js";
import { RulesValidation } from "@/utils/validations";
import { mapStores } from "pinia";
import { useAlertMessageStore } from "@/store/alertMessage";
import DynamicSelectField from "@/components/blocks/DynamicSelectField.vue";
import DynamicProductList from "./DynamicProductList.vue";
import SupplierApi from '@/services/Forms/SupplierApi';
import ProductApi from '@/services/Forms/ProductApi';
import { castFullDate } from '@/utils/cast';


const purchaseOrderApi = new PurchaseOrderApi();
const supplierApi = new SupplierApi();
const productApi = new ProductApi();

export default {
  name: "FormPurchaseOrder",
  props: {
    idEditForm: Number,
    nameTable: String,
    path: String,
  },
  components: {
    DynamicSelectField,
    DynamicProductList
  },
  data: () => ({
    // required data
    loading: false,
    editItem: {
      products: []
    },
    // optional data
    rulesValidation: RulesValidation,
    status: [
      { name: "A", label: "Activo" },
      { name: "I", label: "Inactivo" },
    ],
    thirdKeyCard: 0,
    suppliers: [],
    products: [],
    editable: false,
    errorMessage:{}
  }),
  async mounted() {
    this.loading = true;
    try {
      await Promise.all([this.setEditItem(), this.setSuppliers(), this.setProducts()]);
    } catch (error) {
      console.error("Alguna de las funciones falló:", error);
    }
    this.loading = false;
  },
  computed: {
    title() {
      return this.idEditForm
        ? `Formulario de edición`
        : `Formulario de creación`;
    },
    ...mapStores(useAlertMessageStore),
  },
  methods: {
    async setSuppliers(name = null) {
      const query = name ? `&filters[0][key]=third&filters[0][value]=${name}` : "";
      this.suppliers = (await supplierApi.read(`format=short${query}`)).data;
    },
    async setProducts(name = null) {
      const query = name ? `&filters[0][key]=name&filters[0][value]=${name}` : ""
      this.products = (await productApi.read(`format=short${query}`)).data;
    },
    async submitForm() {
      this.loading = true;
      const { valid } = await this.$refs.form.validate();
      if (
         this.editItem.products.length == 0
      ) {
        this.errorMessage.type = "products";
        this.errorMessage.message = "Se requiere minimo un producto";
      }else{
        this.errorMessage = {};
        if (valid) {
        //passing validations 🚥
        const formData = new FormData();
        let response = {};
        // third fields 🚥
        formData.append("date", castFullDate(this.editItem.date));
        formData.append("supplier_id", this.editItem.supplier.id);
        formData.append("status", this.editItem.status);

        if(this.editItem.note && this.editItem.note.length > 0) formData.append("note", this.editItem.note);
        this.editItem.products.forEach((product, pindex) => {
          formData.append(`products[${pindex}][product_id]`, product.id);
          formData.append(`products[${pindex}][amount]`, product.amount);
        });
        if (this.idEditForm) {
          formData.append("purchase_order_id", this.editItem.purchaseOrderId);

          response = await purchaseOrderApi.update(formData);
        } else {
          response = await purchaseOrderApi.create(formData);
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
      }

      this.loading = false;
    },
    async setEditItem() {
      if (!this.idEditForm){

        return;
      }
      const response = await purchaseOrderApi.read(
        `purchase_order_id=${this.idEditForm}`
      );
      if (response.statusResponse != 200) {
        this.editItem = {};
        return;
      }
      this.editItem = Object.assign(
        {},
        {
          //warehouse attributes
          purchaseOrderId: response.data.id,
          date: response.data.date,
          note: response.data.note,
          status: response.data.status,
          products: response.data.products,
          supplier: response.data.supplier,
        }
      );

      this.thirdKeyCard = this.thirdKeyCard + 1;
    },
  },

};
</script>
