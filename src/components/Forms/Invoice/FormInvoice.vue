<template>
  <modal-reload @reload-form-data="loadItems"></modal-reload>
  <btn-invoice-download
    v-if="editItem.invoiceId"
    :invoiceId="editItem.invoiceId"
  ></btn-invoice-download>
  <v-stepper class="mt-3" v-model="step" :key="test">
    <v-stepper-header>
      <template v-for="(stepper, i) in stepperLabels" :key="`${i}-step`">
        <v-stepper-item
          :complete="stepper.complete"
          :title="stepper.label"
          :value="i"
          :editable="i == 0 || editItem.invoiceId ? true : false"
          :error="stepper.error"
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
            :totalCost="totalCost"
          ></invoice-field-group>
        </v-form>
      </v-stepper-window-item>
      <v-stepper-window-item :value="1">
        <v-form ref="formProduct">
          <dynamic-further-product-table
            v-if="editItem.type && editItem.type.id == 'P'"
            :records="productPlanmentStore.productEvents"
            :errorMessage="errorMessage"
            errorKey="products"
            :editable="false"
            @update:records="(item) =>  productPlanmentStore.productEvents = item"
          ></dynamic-further-product-table>
          <div v-else>
            <dynamic-product-table
              :errorMessage="errorMessage"
              :editable="false"
              kindProduct="E"
            ></dynamic-product-table>
            <div class="d-flex justify-center py-5">
              <v-btn
                variant="text"
                :append-icon="
                  showSubproducts ? 'mdi-chevron-up' : 'mdi-chevron-down'
                "
                size="small"
                color="success"
                @click="hideSubproducts"
              >
                Editar subproductos
              </v-btn>
            </div>
            <dynamic-subproduct-table
              v-if="showSubproducts"
              :errorMessage="errorMessage"
              :editable="false"
            ></dynamic-subproduct-table>
          </div>
        </v-form>
      </v-stepper-window-item>
      <v-stepper-window-item :value="2">
        <v-form ref="formFurtherProduct">
          <dynamic-further-product-table
            :records="furtherProducts"
            :errorMessage="errorMessage"
            :editable="false"
            @update:records="
              (item) => furtherProducts = item
            "
          ></dynamic-further-product-table>
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
          <h4
            class="text-subtitle-2 text-md-right text-center font-weight-light"
          >
            Precio neto
          </h4>
        </div>
        <div class="pl-5">
          <h3 class="text-h5 font-weight text-md-right text-center text-green">
            {{ calTotalCost() }}
          </h3>
          <h4
            class="text-subtitle-2 text-md-right text-center font-weight-light"
          >
            Precio total
          </h4>
        </div>
        <div class="pl-5">
          <h3 class="text-h5 font-weight text-center text-orange">
            {{ calTotalDiscount() }}
          </h3>
          <h4
            class="text-subtitle-2 text-md-right text-center font-weight-light"
          >
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
import { mapActions, mapStores } from "pinia";
import { useAlertMessageStore } from "@/store/alertMessage";
import {
  calTotalCostItems,
  calTotalDiscountItems,
  castFullDate,
  castStorageToObject,
  formatNumberToColPesos,
  statusAllowed,
} from "@/utils/cast";
//import dynamicFieldList from "@/components/Forms/Service/dynamicFieldList.vue";
import InvoiceFieldGroup from "@/components/Cards/InvoiceFieldGroup.vue";
import DynamicProductTable from "@/components/Forms/Planment/DynamicProductTable.vue";
import DynamicFurtherProductTable from "@/components/Forms/Planment/DynamicFurtherProductTable.vue";
import DynamicSubproductTable from "@/components/Forms/Planment/DynamicSubproductTable.vue";
import ProductApi from "@/services/Forms/ProductApi";
import BtnInvoiceDownload from "@/components/blocks/BtnInvoiceDownload.vue";
import { useProductPlanmentStore } from "@/store/productPlanment";
import ModalReload from "@/components/blocks/ModalReload.vue";
import { useCheckInvoiceStep } from "@/store/checkInvoiceStep";

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
    DynamicProductTable,
    DynamicFurtherProductTable,
    DynamicSubproductTable,
    BtnInvoiceDownload,
    ModalReload,
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
        complete: true,
      },
      { label: "Productos requeridos", complete: true },
    ],
    //data
    products: [],
    furtherProducts: [],
    showSubproducts: false,
    totalCost: 0,
    totalDiscount: 0,
    draftData: localStorage.getItem("formData"),

  }),
  async mounted() {
    this.loading = true;
    this.status = statusAllowed();
    if (this.draftData === null) await this.loadItems();
    this.checkInvoiceStepStore.$reset();
    this.loading = false;
    window.addEventListener("beforeunload", this.leaving);
    this.$subscribe((mutation, state) => {
      if(mutation.storeId == 'checkInvoiceStep'){
          if(state.check){
            this.stepperLabels[this.step].complete =  false;
          }
      }
    });
  },
  beforeUnmount() {
    window.removeEventListener("beforeunload", this.leaving);
  },
  watch: {
    step(_newV, oldV) {
      // console.log('entry::',this.checkInvoiceStepStore.check,value, this.step)
      if (this.checkInvoiceStepStore.check) {
        this.stepperLabels[oldV].complete = false;
      }
      this.checkInvoiceStepStore.$reset();
      this.errorMessage = {};
    },
  },
  computed: {
    title() {
      return this.idEditForm
        ? `Edición de ${this.nameTable}`
        : `Creación de ${this.nameTable}`;
    },
    netTotal() {
      const wholeTax = this.editItem.taxes
        ? this.editItem.taxes.reduce((total, item) => {
          console.log('tax',item,total);
            const totalTax =
              ((item.type == "D" ? -1 : 1) *
                (item.percent || 0) *
                this.totalCost) /
                100 ?? 0;
            return total  + (+totalTax);
          }, 0)
        : 0;
        console.log('taxEnd', wholeTax);
      return formatNumberToColPesos(
        this.totalCost - this.totalDiscount + wholeTax
      );
    },
    ...mapStores(
      useAlertMessageStore,
      useProductPlanmentStore,
      useCheckInvoiceStep
    ),
  },
  methods: {
    ...mapActions(useCheckInvoiceStep, ['$subscribe']),
    leaving() {
      if (
        this.stepperLabels.filter((item) => item.complete == false).length > 0
      ) {
        console.log('sdf', this.productPlanmentStore.productEvents);
        localStorage.setItem(
          "formData",
          JSON.stringify({
            editItem: this.editItem,
            products: this.productPlanmentStore.productEvents,
            subproducts: this.productPlanmentStore.subproducts,
            furtherProducts: this.furtherProducts,
            step: this.step,
            stepperLabels: this.stepperLabels,
          })
        );
      }
    },
    async loadDraftItem() {
      return new Promise(() => {
        let draft = this.draftData;
        draft = castStorageToObject(draft);
        console.log('borrador Load', draft)
        this.editItem = draft.editItem;
        this.productPlanmentStore.productEvents = draft.products;
        if (this.editItem.type.id == "E") {
          this.productPlanmentStore.subproducts = draft.subproducts;
          this.furtherProducts = draft.furtherProducts;
        }
        this.stepperLabels = draft.stepperLabels;
        this.step = draft.step;
      }).then(() => localStorage.removeItem("formData"));
      //clean local storage from data form ?
    },
    async loadItems(checkLoad = false) {
      try {
        console.log('entry...');
        if (checkLoad) {
          await this.loadDraftItem();
        } else {
          await this.setEditItem();
        }
        if (this.editItem.invoiceId) {
          this.editItem.type.id == "E"
            ? await Promise.all([
                this.setAttributes("E", "products"),
                this.setAttributes("S", "subproducts"),
                this.setAttributes("F", "furtherProducts"),
              ])
            : await this.setAttributes("I", "products");
        }
        localStorage.removeItem("formData");
      } catch (error) {
        console.error("Alguna de las funciones falló:", error);
      }
    },
    async hideSubproducts() {
      this.loading = true;
      const { valid } = await this.$refs.formInvoice.validate();
      if (valid) {
        this.showSubproducts = !this.showSubproducts;
      }
      this.loading = false;
    },
    changeSteppers(value) {

      this.editItem.type = value;
      this.products = [];
      if (value.id == "E") {
        this.stepperLabels[1].label = "Servicios requeridos";
        if (this.stepperLabels.length < 3)
          this.stepperLabels.push({
            label: "Productos adicionales",
            complete: false,
          });
          console.log('changeStepper',this.editItem)
          this.editItem.startDate = new Date().toISOString().slice(0, 16);

          this.productPlanmentStore.productEvents = [];
          console.log('changeStepper',this.editItem)
      } else {
        this.stepperLabels[1].label = "Productos requeridos";
        if (this.stepperLabels.length == 3) this.stepperLabels.splice(-1);
      }
    },
    calTotalCost() {
      const totalServices = calTotalCostItems(
        this.productPlanmentStore.productEvents
      );
      console.log('totalFurtherProduct0', totalServices);
      const totalFurtherProducts = calTotalCostItems(this.furtherProducts);
      console.log('totalFurtherProduct', totalFurtherProducts)
      this.totalCost = totalServices + totalFurtherProducts;
      return formatNumberToColPesos(this.totalCost);
    },
    calTotalDiscount() {
      this.totalDiscount =
        calTotalDiscountItems(this.productPlanmentStore.productEvents) +
        calTotalDiscountItems(this.furtherProducts);
      return formatNumberToColPesos(this.totalDiscount);
    },
    async saveRecords() {
      this.loading = true;
      try {
        const formData = new FormData();
        switch (this.step) {
          case 0:
            await this.saveInvoice(formData);
            break;
          case 1:
            await this.saveProducts(formData);
            break;
          case 2:
            await this.saveProducts(formData, true);
            break;
          default:
            break;
        }
        console.log('passing switch', this.step)
        //handle stepper 🚥
        this.stepperLabels[this.step].complete = true;
        this.stepperLabels[this.step].error = false;
        if (this.step + 1 < this.stepperLabels.length) {
          this.step += 1;
        }
        console.log('passing switch2', this.step)

        this.checkInvoiceStepStore.$reset();
      } catch (error) {
        console.error("Error en procedure", error);
        this.stepperLabels[this.step].error = true;
      }
      this.loading = false;
    },
    async saveInvoice(formData) {
      const { valid } = await this.$refs.formInvoice.validate();
      console.log('entrySAveInvoice');
      if (valid) {
        console.log('in valid');
        formData.append("client_id", this.editItem.client.id);
        formData.append("further_discount", this.editItem.furtherDiscount);
        if (this.editItem.note && this.editItem.note.length > 0)
          formData.append("note", this.editItem.note);
        formData.append("seller_id", this.editItem.seller.id);
        formData.append("date", castFullDate(this.editItem.date));
        formData.append("sale_type", this.editItem.type.id);
        let response = {};
        if (this.editItem.type.id == "E") {
          formData.append("start_date", castFullDate(this.editItem.startDate));
          formData.append("end_date", castFullDate(this.editItem.endDate));
          if (this.editItem.payOff)
            formData.append("pay_off", this.editItem.payOff);
          formData.append("stage", this.editItem.stage.id);
        }
        if (this.editItem.taxes && this.editItem.taxes.length > 0) {
          this.editItem.taxes.forEach((tax, pindex) => {
            formData.append(`taxes[${pindex}][tax_id]`, tax.id);
            formData.append(`taxes[${pindex}][percent]`, tax.percent);
          });
        }
        if (this.editItem.invoiceId) {
          formData.append("invoice_id", this.editItem.invoiceId);
          response = await invoiceApi.update(formData);
        } else {
          response = await invoiceApi.create(formData);
        }
        this.handleAlert(response, this.setEditItem(response.data));
      } else {
        throw new Error("Error de campos");
      }
    },
    async saveProducts(formData, further = false) {
      //validate form rules 🚥
      const { valid } = await this.$refs[
        further ? "formFurtherProduct" : "formProduct"
      ].validate();
      //validate dynamic components 🚥
      console.log('entry', this.productPlanmentStore.productEvents.length, this.step, this.editItem.type.id);
      if (
        (this.productPlanmentStore.productEvents.length == 0 &&
          (this.editItem.type.id == "E" || this.editItem.type.id == "P") && this.step == 1)

      ) {
        this.errorMessage.type = "products";
        this.errorMessage.message = "Se requiere minimo un producto";

        throw new Error("Error de campos");
      } else {
        this.errorMessage = {};
      }
      if (valid) {
        //define array to start creating formData 🚥
        const source = further ? "furtherProducts" : "products";
        const pushProduct = further
          ? this.furtherProducts
          : this.productPlanmentStore.productEvents;
        formData.append("invoice_id", this.editItem.invoiceId);
        pushProduct.forEach((product, pindex) => {
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
        if (this.step == 1 && this.editItem.type.id == "E") {
          this.productPlanmentStore.subproducts.forEach(
            (subproduct, sindex) => {
              formData.append(
                `subproducts[${sindex}][product_id]`,
                subproduct.id
              );
              formData.append(
                `subproducts[${sindex}][amount]`,
                subproduct.amount
              );
              formData.append(
                `subproducts[${sindex}][tracing]`,
                subproduct.tracing || 0
              );
              if (subproduct.tracing)
                formData.append(
                  `subproducts[${sindex}][warehouse_id]`,
                  subproduct.warehouse.id
                );
              subproduct.events.forEach((event, eindex) => {
                formData.append(
                  `subproducts[${sindex}][events][${eindex}][product_id]`,
                  event.id
                );
                formData.append(
                  `subproducts[${sindex}][events][${eindex}][amount]`,
                  event.amount
                );
              });
            }
          );
        } else {
          type = this.editItem.type.id == "P" ? "I" : "F";
          formData.append(`type_connection`, type);
          pushProduct.forEach((product, pindex) => {
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
      } else {
        throw new Error("Error de campos");
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
        throw new Error("Error de campos");
      } else {
        this.alertMessageStore.show(true, "Proceso exitoso!");
        if (callback && typeof callback === "function") await callback();
      }
      this.loading = false;
    },
    updateAttributes(data) {
      this.editItem[data.key] = data.item;
    },
    // ------------------------ getting data from serve ----------
    async setAttributes(key, keyArray) {
      const response = await invoiceApi.read(
        `invoice_id=${this.editItem.invoiceId}&attribute_key=${key}`
      );

      switch (keyArray) {
        case "products":
          this.productPlanmentStore.productEvents = response.data;
          break;
        case "subproducts":
          this.productPlanmentStore.subproducts = response.data;
          break;
        default:
          this[keyArray] = response.data ?? [];
      }
    },

    async setEditItem(invoiceId = null) {
      if (!this.idEditForm && !invoiceId) {
        console.log("entry1?");
        this.editItem.services = [];
        this.editItem.taxes = [];
        this.editItem.date = new Date().toISOString().substr(0, 10);

        this.editItem.stage = {
          name: "Cotización",
          id: "QUO",
        };
        this.stepperLabels.forEach((item) => (item.complete = false));
        return;
      }
      console.log("entry??");
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
          taxes: response.data.taxes || [],
        }
      );
      if (response.data.sale_type.id == "E") {
        this.stepperLabels[1].label = "Servicios requeridos";
        this.stepperLabels.push({
          label: "Productos adicionales",
          complete: true,
        });
        this.editItem = Object.assign(this.editItem, {
          payOff: response.data.planment.pay_off,
          startDate: response.data.planment.start_date,
          endDate: response.data.planment.end_date,
          stage: response.data.planment.stage,
        });
      }
      // ------------------updating keys of stepper to send reactive data ⚠️
      this.thirdKeyCard = this.thirdKeyCard + 1;
      this.test = this.test + 1;
    },
  },
};
</script>
