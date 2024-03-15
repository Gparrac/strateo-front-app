<template>
  <v-stepper
    class="mt-3"
    v-model="step"
    :key="test"
    @update:modelValue="updateStepper"
  >
    <v-stepper-header>
      <template v-for="(stepper, i) in stepperLabels" :key="`${i}-step`">
        <v-stepper-item
          :complete="stepper.complete"
          :title="stepper.label"
          :value="i"
          :editable="i == 0 || editItem.invoiceId ? true : false"
        >
        </v-stepper-item>
        <v-divider v-if="i < stepperLabels.length - 1" :key="i"></v-divider>
      </template>
    </v-stepper-header>
    <v-stepper-window>
      <v-stepper-window-item :value="0">
        <v-form ref="formInvoice">
          <invoice-field-group
            :records="editItem"
            @update:records="updateAttributes"
            :showPlanment="false"
          ></invoice-field-group>
        </v-form>
      </v-stepper-window-item>
      <v-stepper-window-item :value="1">
        <v-form ref="formProduct">
          <dynamic-product-list
            :records="products"
            :errorMessage="errorMessage"
            :editable="false"
            @update:records="(item) => (products = item)"
          ></dynamic-product-list>
        </v-form>
      </v-stepper-window-item>
    </v-stepper-window>
    <!-- --------------------------- invoice data -------------------->

    <!-- --------------------------- end invoice data -------------------->
    <template v-slot:[`actions`]>
      <div class="d-flex pb-5 flex-row-reverse">
        <v-btn
          color="blue-darken-1"
          variant="text"
          @click="saveRecords"
          :loading="loading"
        >
          continuar
        </v-btn>
        <v-btn
          color="blue-darken-1"
          variant="text"
          @click="() => $router.push(`/${path}`)"
          :loading="loading"
        >
          Cerrar
        </v-btn>
      </div>
    </template>
  </v-stepper>
</template>

<script>
import InvoiceApi from "@/services/Forms/InvoiceApi";
import { RulesValidation } from "@/utils/validations";
import { mapStores } from "pinia";
import { useAlertMessageStore } from "@/store/alertMessage";
import { castFullDate, statusAllowed } from "@/utils/cast";
//import dynamicFieldList from "@/components/Forms/Service/dynamicFieldList.vue";
import InvoiceFieldGroup from "@/components/blocks/InvoiceFieldGroup.vue";
import DynamicProductList from "./DynamicProductList.vue";
import ProductApi from "@/services/Forms/ProductApi";
const invoiceApi = new InvoiceApi();
const productApi = new ProductApi();


export default {
  props: {
    idEditForm: Number,
    nameTable: String,
    path: String,
  },
  components: {
    InvoiceFieldGroup,
    DynamicProductList,
  },
  data: () => ({
    // required data
    loading: false,
    editItem: {},
    // optional data
    errorMessage: {},
    formRef: null,
    status: [],
    showFileCommercialSelected: null,
    showFileRutSelected: null,
    rulesValidation: RulesValidation,
    customAlertError: {},
    thirdKeyCard: 0,
    test: 0,
    //step attributes
    step: 0,
    stepperLabels: [
      {
        label: "Datos de la orden",
        complete: false,
      },
      { label: "Productos requeridos", complete: false },
    ],
    //data
    products: [],
    employees: []
  }),

  async mounted() {
    this.loading = true;
    this.status = statusAllowed();
    try {
      await this.setEditItem();
      if (this.editItem.invoiceId) {
          await this.setAttributes("I", "products");
        }
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
    updateStepper(value) {
      this.stepperLabels[value].complete = false;
      this.errorMessage = {};
    },
    saveRecords() {
      this.loading = true;
      const formData = new FormData();
      switch (this.step) {
        case 0:
          this.saveInvoice(formData);
          break;
        case 1:
          this.saveProducts(formData);
          break;
        default:
          break;
      }
      this.loading = false;
    },
    async saveInvoice(formData) {
      const { valid } = await this.$refs.formInvoice.validate();
      if (valid) {
        formData.append("client_id", this.editItem.client.id);
        formData.append("further_discount", this.editItem.furtherDiscount);
        formData.append("note", this.editItem.note);
        formData.append("seller_id", this.editItem.seller.id);
        formData.append("date", castFullDate(this.editItem.date));
        let response = {};
        if (this.editItem.invoiceId) {
          formData.append("invoice_id", this.editItem.invoiceId);
          response = await invoiceApi.update(formData);
        } else {
          formData.append("sale_type", 'P');
          response = await invoiceApi.create(formData);
        }
        this.handleAlert(response, this.setEditItem(response.data));
      }
    },
    async saveProducts(formData) {
      //validate form rules 🚥
      const { valid } = await this.$refs.formProduct.validate();
      //validate dynamic components 🚥
      if (
        (this.products.length == 0)
      ) {
        this.errorMessage.type = "products";
        this.errorMessage.message = "Se requiere minimo un producto";

        return;
      } else {
        this.errorMessage = {};
      }
      if (valid) {
        //define array to start creating formData 🚥

        formData.append("invoice_id", this.editItem.invoiceId);
        this.products.forEach((product, pindex) => {
          formData.append(`products[${pindex}][product_id]`, product.id);
          formData.append(`products[${pindex}][cost]`, product.cost);
          if (product.discount)
            formData.append(`products[${pindex}][discount]`, product.discount);
          formData.append(`products[${pindex}][amount]`, product.amount);
          product.taxes.forEach((tax, tindex) => {
            formData.append(
              `products[${pindex}][taxes][${tindex}][tax_id]`,
              tax.id
            );
            formData.append(
              `products[${pindex}][taxes][${tindex}][percent]`,
              tax.percent
            );
          });
        });
          formData.append(`type_connection`, "I");
          this.products.forEach((product, pindex) => {
            formData.append(
              `products[${pindex}][tracing]`,
              product.tracing || 0
            );
            if (product.tracing)
              formData.append(
                `products[${pindex}][warehouse_id]`,
                product.warehouse.id
              );
          });

        let response = {};

        response = await productApi.update(formData, "type_connection=I");
        this.handleAlert(response, this.setAttributes('I', 'products'));
      }
    },
    async handleAlert(response, callback = null) {
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
        if (callback && typeof callback === "function") await callback();
        this.stepperLabels[this.step].complete = true;

        if (this.step + 1 < this.stepperLabels.length) {
          this.step += 1;
        }
      }
      this.loading = false;
    },
    updateAttributes(data) {
      this.editItem[data.key] = data.item;
    },
    setRecords(item) {
      this.editItem = { ...this.editItem, ...item };
      this.stepperLabels[this.step].complete = true;
      this.step += 1;
    },
    // ------------------------ getting data from serve ----------
    async setAttributes(key, keyArray) {
      const response = await invoiceApi.read(
        `invoice_id=${this.editItem.invoiceId}&attribute_key=${key}`
      );

      this[keyArray] = response.data;
    },

    async setEditItem(invoiceId = null) {
      if (!this.idEditForm && !invoiceId) {
        this.editItem.services = [];
        return;
      }
      const id = this.idEditForm ?? invoiceId;
      const response = await invoiceApi.read(`invoice_id=${id}`);
      this.editItem = Object.assign(
        {},
        {
          invoiceId: response.data.id,
          note: response.data.note,
          furtherDiscount: response.data.further_discount,
          date: response.data.date,
          seller: response.data.seller,
          client: response.data.client,
        }
      );
      // ------------------updating keys of stepper to send reactive data ⚠️
      this.thirdKeyCard = this.thirdKeyCard + 1;
      this.test = this.test + 1;
    },
  },
};
</script>
