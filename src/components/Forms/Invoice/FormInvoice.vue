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
            @update:type="changeSteppers"
          ></invoice-field-group>
        </v-form>
      </v-stepper-window-item>
      <v-stepper-window-item :value="1">
        <v-form ref="formProduct">
          <dynamic-service-list
          v-if="editItem.type && editItem.type.id == 'E'"
            :records="products"
            :errorMessage="errorMessage"
            :editable="false"
            @update:records="(item) => (products = item)"
          ></dynamic-service-list>
          <dynamic-product-list
            v-else
            :records="products"
            :errorMessage="errorMessage"
            :editable="false"
            @update:records="(item) => (products = item)"
          ></dynamic-product-list>
        </v-form>
      </v-stepper-window-item>
      <v-stepper-window-item :value="2">
        <v-form ref="formFurtherProduct">
          <dynamic-product-list
            :records="furtherProducts"
            :errorMessage="errorMessage"
            :editable="false"
            @update:records="(item) => (furtherProducts = item)"
          ></dynamic-product-list>
        </v-form>
      </v-stepper-window-item>
    </v-stepper-window>
    <!-- --------------------------- invoice data -------------------->

    <!-- --------------------------- end invoice data -------------------->
    <template v-slot:[`actions`]>
      <div class="d-flex justify-md-start px-4 flex-wrap justify-center">
        <div class="mx-4">
          <h3 class="text-h5 font-weight text-center text-primary">
            {{ netTotal }}
          </h3>
          <h4 class="text-subtitle-2 text-md-right text-center font-weight-light">
            Costo neto
          </h4>
        </div>
        <div class="pl-5">
          <h3 class="text-h5 font-weight text-md-right text-center text-green">
            {{ calTotalCost() }}
          </h3>
          <h4 class="text-subtitle-2 text-md-right text-center font-weight-light">
            Costo total
          </h4>
        </div>
        <div class="pl-5">
          <h3 class="text-h5 font-weight text-center text-orange">
            {{ calTotalDiscount() }}
          </h3>
          <h4 class="text-subtitle-2 text-md-right text-center font-weight-light">
            Impuestos
          </h4>
        </div>
      </div>
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
import { calTotalCostItems, castFullDate, formatNumberToColPesos, statusAllowed } from "@/utils/cast";
//import dynamicFieldList from "@/components/Forms/Service/dynamicFieldList.vue";
import InvoiceFieldGroup from "@/components/blocks/InvoiceFieldGroup.vue";
import DynamicProductList from "./DynamicProductList.vue";
import DynamicServiceList from "../Planment/DynamicServiceList.vue";
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
    DynamicServiceList
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
    furtherProducts: [],
    totalCost: 0,
    totalDiscount: 0,
  }),

  async mounted() {
    this.loading = true;
    this.status = statusAllowed();
    try {
      await this.setEditItem();
      if (this.editItem.invoiceId) {
        await Promise.all([
          await this.setAttributes(this.editItem.type.id == 'E' ? 'E' : 'I', "products"),
          await this.setAttributes("F", "furtherProducts")
        ]);
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
    netTotal() {
      return formatNumberToColPesos(this.totalCost - this.totalDiscount);
    },
    ...mapStores(useAlertMessageStore),
  },
  methods: {
    changeSteppers(value){
      this.editItem.type = value;
      this.products = [];
      console.log('before',this.editItem)
      if(value.id == 'E'){
        this.stepperLabels[1].label = 'Servicios requeridos'
        if(this.stepperLabels.length < 3) this.stepperLabels.push({label:'Productos adicionales', complete: false})
      }else{
        console.log('entry', this.stepperLabels.length)
        this.stepperLabels[1].label = 'Productos requeridos';
        if(this.stepperLabels.length == 3) this.stepperLabels.splice(-1);
      }
    },
    calTotalCost() {
      const totalServices = calTotalCostItems(this.products);
      const totalFurtherProducts = calTotalCostItems(this.furtherProducts);
      this.totalCost = totalServices + totalFurtherProducts - (this.editItem.furtherDiscount || 0 );
      return formatNumberToColPesos(this.totalCost);
    },
    calTotalDiscount() {
      this.totalDiscount = this.products.reduce((acc, obj) => {
        const taxes = obj.taxes
          ? obj.taxes.reduce((total, item) => total + (+item.percent || 0), 0)
          : 0;
        // Si el objeto no tiene 'amount' o 'cost', se toma como 0

        const total = (obj.cost * obj.amount || 0) - (obj.discount || 0);
        // Sumar el producto de 'amount' y 'cost' al acumulador
        return acc  + (taxes * total) / 100;
      }, 0);
      return formatNumberToColPesos(this.totalDiscount);
    },

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
        case 2:
          this.saveProducts(formData,true);
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
        if (this.note && this.note.length > 0)
          formData.append("note", this.editItem.note);
        formData.append("seller_id", this.editItem.seller.id);
        formData.append("date", castFullDate(this.editItem.date));
        formData.append("sale_type", this.editItem.type.id);
        let response = {};
        if(this.editItem.type.id == 'E'){
          formData.append("start_date", castFullDate(this.editItem.startDate));
          formData.append("end_date", castFullDate(this.editItem.endDate));
          formData.append("pay_off", this.editItem.payOff);
          formData.append("stage", this.editItem.stage.id);
        }
        if (this.editItem.invoiceId) {
          formData.append("invoice_id", this.editItem.invoiceId);
          response = await invoiceApi.update(formData);
        } else {
          response = await invoiceApi.create(formData);
        }
        this.handleAlert(response, this.setEditItem(response.data));
      }
    },
    async saveProducts(formData, further = false) {
      //validate form rules 🚥
      const { valid } = await this.$refs.formProduct.validate();
      //validate dynamic components 🚥
      if ((this.products.length == 0 && this.step == 1) || (this.furtherProducts.length == 0 && this.step == 2)) {
        this.errorMessage.type = "products";
        this.errorMessage.message = "Se requiere minimo un producto";

        return;
      } else {
        this.errorMessage = {};
      }
      if (valid) {
        //define array to start creating formData 🚥
        const source = further ? "furtherProducts" : "products";
        formData.append("invoice_id", this.editItem.invoiceId);
        this[source].forEach((product, pindex) => {
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

        let type = "E";
        if (this.step == 1 && this.editItem.type.id == 'E') {
          this.products.forEach((product, pindex) => {
            product.subproducts.forEach((subproduct, sindex) => {
              formData.append(
                `products[${pindex}][sub_products][${sindex}][product_id]`,
                subproduct.id
              );
              formData.append(
                `products[${pindex}][sub_products][${sindex}][amount]`,
                subproduct.amount
              );
              formData.append(
                `products[${pindex}][sub_products][${sindex}][tracing]`,
                subproduct.tracing || 0
              );
              if (subproduct.tracing)
                formData.append(
                  `products[${pindex}][sub_products][${sindex}][warehouse_id]`,
                  subproduct.warehouse.id
                );
            });
          });

        } else {
          console.log('else',this.editItem.type);
          type = this.editItem.type.id == 'P' ? 'I' : "F";
          formData.append(`type_connection`, type);
          this[source].forEach((product, pindex) => {
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
        }

        let response = {};

        response = await productApi.update(formData, `type_connection=${type}`);
        this.handleAlert(response, this.setAttributes(type, source));
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
        this.editItem.date = new Date().toISOString().substr(0, 10);
        console.log('entry?')
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
          date: response.data.date.split(" ")[0],
          seller: response.data.seller,
          client: response.data.client,
          type: response.data.sale_type,
        }
      );
      console.log('type invoice', response.data.sale_type)
      if(response.data.sale_type.id == 'E'){
        this.stepperLabels[1].label = 'Servicios requeridos'
        this.stepperLabels.push({label:'Productos adicionales', complete: false})
        this.editItem = Object.assign(this.editItem, {
          payOff: response.data.planment.pay_off,
          startDate: response.data.planment.start_date,
          endDate: response.data.planment.end_date,
          stage: response.data.planment.stage
        });
      }
      // ------------------updating keys of stepper to send reactive data ⚠️
      this.thirdKeyCard = this.thirdKeyCard + 1;
      this.test = this.test + 1;
    },
  },
};
</script>
