<template>
  <modal-reload @reload-form-data="loadItems"></modal-reload>
  <btn-invoice-download
    v-if="editItem.invoiceId"
    :invoiceId="editItem.invoiceId"
  ></btn-invoice-download>
  <v-stepper
    v-if="!mValidateEmtyObj(editItem)"
    class="mt-3"
    v-model="step"
    :key="test"

  >
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
            @update:records="(item) => updateAttributes(item, 'invoice')"
            :showPlanment="true"
            :totalCost="totalCost"
          ></invoice-field-group>
        </v-form>
      </v-stepper-window-item>
      <v-stepper-window-item :value="1">
        <v-form ref="formProduct">
          <dynamic-product-table
            :errorMessage="errorMessage"
            :editable="false"
            kindProduct="E"
          ></dynamic-product-table>
          <dynamic-subproduct-table
            :errorMessage="errorMessage"
            :editable="false"
          ></dynamic-subproduct-table>
        </v-form>
      </v-stepper-window-item>
      <v-stepper-window-item :value="2">
        <v-form ref="formFurtherProduct">
          <dynamic-further-product-table
            :records="furtherProducts"
            :errorMessage="errorMessage"
            :editable="false"
            @update:records="
              (item) => updateAttributes(item, 'furtherProducts')
            "
          ></dynamic-further-product-table>
        </v-form>
      </v-stepper-window-item>
      <v-stepper-window-item :value="3">
        <v-form ref="formLibrettoActivity">
          <dynamic-libretto-activity-list
            :records="librettoActivities"
            :serviceRelatedRecords="sLibrettoActivities"
            :errorMessage="errorMessage"
            :editable="false"
            @update:records="
              (item) => updateAttributes(item, 'librettoActivities')
            "
          ></dynamic-libretto-activity-list>
        </v-form>
      </v-stepper-window-item>
      <v-stepper-window-item :value="4">
        <v-form ref="formEmployee">
          <dynamic-employee-list
            :records="employees"
            :errorMessage="errorMessage"
            :editable="false"
            @update:records="(item) => updateAttributes(item, 'employees')"
          >
            ></dynamic-employee-list
          >
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
import { RulesValidation, validateEmtyObj } from "@/utils/validations";
import { mapActions, mapStores } from "pinia";
import { useAlertMessageStore } from "@/store/alertMessage";
import {
  castFullDate,
  statusAllowed,
  calTotalCostItems,
  calTotalDiscountItems,
  formatNumberToColPesos,
  castStorageToObject,
} from "@/utils/cast";
//import dynamicFieldList from "@/components/Forms/Service/dynamicFieldList.vue";
import InvoiceFieldGroup from "@/components/Cards/InvoiceFieldGroup.vue";

import DynamicEmployeeList from "./DynamicEmployeeList.vue";

import DynamicLibrettoActivityList from "./DynamicLibrettoActivityList.vue";
import ProductApi from "@/services/Forms/ProductApi";
import EmployeeApi from "@/services/Forms/EmployeeApi";
import LibrettoActivityApi from "@/services/Forms/LibrettoActivityApi";
import BtnInvoiceDownload from "@/components/blocks/BtnInvoiceDownload.vue";
import ModalReload from "@/components/blocks/ModalReload.vue";
import DynamicProductTable from "./DynamicProductTable.vue";

import { useProductPlanmentStore } from "@/store/productPlanment";
import DynamicSubproductTable from "@/components/Forms/Planment/DynamicSubproductTable.vue"
import DynamicFurtherProductTable from "./DynamicFurtherProductTable.vue";
import { useCheckInvoiceStep } from "@/store/checkInvoiceStep";

const invoiceApi = new InvoiceApi();
const productApi = new ProductApi();
const employeeApi = new EmployeeApi();
const librettoActivityApi = new LibrettoActivityApi();
export default {
  props: {
    idEditForm: Number,
    nameTable: String,
    path: String,
  },
  components: {
    InvoiceFieldGroup,
    DynamicFurtherProductTable,
    DynamicEmployeeList,
    DynamicSubproductTable,
    DynamicLibrettoActivityList,
    BtnInvoiceDownload,
    ModalReload,
    DynamicProductTable,
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
      { label: "Adicionales", complete: true },
      { label: "Libreto de actividades", complete: true },
      { label: "Empleados", complete: true },
    ],

    //data
    products: [],
    employees: [],
    furtherProducts: [],
    librettoActivities: [],
    sLibrettoActivities: [],
    totalCost: 0,
    totalDiscount: 0,
    draftData: localStorage.getItem("formData"),
    keyServices: 0,
  }),
  beforeRouteLeave(_to, _from, next) {
    console.log('reloading ??#')

    next();
  },
  async mounted() {
    this.loading = true;
    this.status = statusAllowed();
    if (this.draftData === null) await this.loadItems();
    this.loading = false;
    //events to create draft data ⚠️
    window.addEventListener("beforeunload", this.leaving);
    //watcher data updated to change stepper attributes 🚥
    this.$subscribe((mutation, state) => {
      if(mutation.storeId == 'checkInvoiceStep'){
          if(state.check){
            this.stepperLabels[this.step].complete =  false;
          }
      }
    });
  },
  beforeUnmount() {
    window.removeEventListener('beforeunload', this.leaving);
  },
  watch:{
    step(_newV, oldV){
      // console.log('entry::',this.checkInvoiceStepStore.check,value, this.step)
      if(this.checkInvoiceStepStore.check){
        this.stepperLabels[oldV].complete = false;
      }
      this.checkInvoiceStepStore.$reset();
      this.errorMessage = {};
    }
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
            const totalTax =
              ((item.type == "D" ? -1 : 1) *
                (item.percent || 0) *
                this.totalCost) /
                100 ?? 0;
            return total + +totalTax;
          }, 0)
        : 0;
      return formatNumberToColPesos(
        this.totalCost + this.totalDiscount + wholeTax
      );
    },
    ...mapStores(useAlertMessageStore, useProductPlanmentStore, useCheckInvoiceStep),
  },
  methods: {
    ...mapActions(useCheckInvoiceStep, ['$subscribe']),
    async loadItems(checkLoad = false) {
      try {
        if (checkLoad) {
          await this.loadDraftItem();
        } else {
          await this.setEditItem();
        }
        if (this.editItem.invoiceId) {
          await Promise.all([
            this.setAttributes("E", "products"),
            this.setAttributes("S", "subproducts"),
            this.setAttributes("F", "furtherProducts"),
            this.setAttributes("W", "employees"),
            this.setAttributes("L", "librettoActivities"),
            this.setAttributes("L", "sLibrettoActivities", "&type_service=S"),
          ]);
        }
        localStorage.removeItem("formData");
      } catch (error) {
        console.error("Alguna de las funciones falló:", error);
      }
    },
    leaving() {
    if (this.stepperLabels.filter((item)=> item.complete == false).length > 0){
        localStorage.setItem(
        "formData",
        JSON.stringify({
          editItem: this.editItem,
          products: this.productPlanmentStore.productEvents,
          subproducts: this.productPlanmentStore.subproducts,
          furtherProducts: this.furtherProducts,
          librettoActivities: this.librettoActivities,
          employees: this.employees,
          stepperLabels:this.stepperLabels,
          step:this.step,
          sLibrettoActivities: this.sLibrettoActivities
        })
      );
    }
    },
    async loadDraftItem() {
      return new Promise(() => {
        let draft = this.draftData;
         draft = castStorageToObject(draft);
        this.editItem = draft.editItem;
        this.employees = draft.employees;
        this.productPlanmentStore.productEvents = draft.products;
        this.productPlanmentStore.subproducts = draft.subproducts;
        this.furtherProducts = draft.furtherProducts;
        this.librettoActivities = draft.librettoActivities;
        this.stepperLabels = draft.stepperLabels;
        this.step = draft.step;
        this.sLibrettoActivities = draft.sLibrettoActivities;

      }).then(()=> localStorage.removeItem("formData"));
      //clean local storage from data form ?
    },
    // methods to cal total amounts
    calTotalCost() {
      const totalServices = calTotalCostItems(this.productPlanmentStore.productEvents);
      const totalFurtherProducts = calTotalCostItems(this.furtherProducts);
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
      try{
      const formData = new FormData();
      switch (this.step) {
        case 0:
          await this.saveInvoice(formData);
          break;
        case 1:
          await this.saveProducts(formData, undefined);
          break;
        case 2:
          await this.saveProducts(formData, true);
          break;
        case 3:
          await this.saveLibrettoActivies(formData, true);
          break;
        case 4:
          await this.saveEmployees(formData);
          break;
        default:
          break;
      }
      //handle stepper 🚥
      this.stepperLabels[this.step].complete = true;
      this.stepperLabels[this.step].error = false;
        if (this.step + 1 < this.stepperLabels.length) {
          this.step += 1;
        }

        this.checkInvoiceStepStore.$reset();
        //end handle stepper 🚦
    }catch(error){
      console.error('Error en procedure', error);
      this.stepperLabels[this.step].error = true;

    }
      this.loading = false;
    },
    async saveLibrettoActivies(formData) {
      const { valid } = await this.$refs.formLibrettoActivity.validate();
      if (this.librettoActivities.length == 0) {
        this.errorMessage.type = "librettoActivities";
        this.errorMessage.message = "Se requiere minimo una actividad";
        throw new Error('Error de actividades');
      } else {
        this.errorMessage = {};
        if (valid) {
          formData.append("invoice_id", this.editItem.invoiceId);
          this.librettoActivities.forEach((la, eindex) => {
            formData.append(
              `libretto_activities[${eindex}][libretto_activity_id]`,
              la.id
            );
            formData.append(
              `libretto_activities[${eindex}][description]`,
              la.description
            );
            if (la.pathFile && typeof la.pathFile != "string") {
              formData.append(
                `libretto_activities[${eindex}][file]`,
                la.pathFile
              );
            }
            formData.append(`libretto_activities[${eindex}][order]`, eindex);
          });
          const response = await librettoActivityApi.update(
            formData,
            "type_connection=I"
          );
          this.handleAlert(
            response,
            this.setAttributes("L", "librettoActivities")
          );
        }else{
          throw new Error('Error de campos');
        }
      }
    },
    async saveEmployees(formData) {
      const { valid } = await this.$refs.formEmployee.validate();
      if (this.employees.length == 0) {
        this.errorMessage.type = "employees";
        this.errorMessage.message = "Se requiere minimo un empleado";
        throw new Error('Employees error');
      } else {
        this.errorMessage = {};
      }

      if (valid) {
        formData.append("invoice_id", this.editItem.invoiceId);
        this.employees.forEach((employee, eindex) => {
          formData.append(`employees[${eindex}][employee_id]`, employee.id);
          formData.append(`employees[${eindex}][salary]`, employee.salary);
        });
        const response = await employeeApi.update(
          formData,
          "type_connection=W"
        );
        this.handleAlert(response, this.setAttributes("W", "employees"));
      }else{
        throw new Error('Employees field error');
      }
    },
    async saveInvoice(formData) {
      const { valid } = await this.$refs.formInvoice.validate();
      if (valid) {
        formData.append("client_id", this.editItem.client.id);
        if (this.editItem.note && this.editItem.note.length > 0)
          formData.append("note", this.editItem.note);
        formData.append("sale_type", "E");
        formData.append("seller_id", this.editItem.seller.id);
        formData.append("date", castFullDate(this.editItem.date));
        formData.append("start_date", castFullDate(this.editItem.startDate));
        formData.append("end_date", castFullDate(this.editItem.endDate));
        if (this.editItem.payOff)
          formData.append("pay_off", this.editItem.payOff);

        formData.append("stage", this.editItem.stage.id);
        if (this.editItem.taxes && this.editItem.taxes.length > 0) {
          this.editItem.taxes.forEach((tax, pindex) => {
            formData.append(`taxes[${pindex}][tax_id]`, tax.id);
            formData.append(`taxes[${pindex}][percent]`, tax.percent);
          });
        }
        let response = {};
        if (this.editItem.invoiceId) {
          formData.append("invoice_id", this.editItem.invoiceId);
          response = await invoiceApi.update(formData);
        } else {
          formData.append("sale_type", "E");
          response = await invoiceApi.create(formData);
        }
        this.handleAlert(response, this.setEditItem(response.data));
      }else{
        throw new Error('Invoice fields error');
      }
    },
    async saveProducts(formData, further = false) {
      //validate form rules 🚥
      const { valid } = await this.$refs[
        further ? "formFurtherProduct" : "formProduct"
      ].validate();
      //validate dynamic components 🚥
      if (
        (this.step == 1 && this.productPlanmentStore.productEvents.length == 0) ||
        (this.step == 2 && this.furtherProducts.length == 0)
      ) {
        this.errorMessage.type = "products";
        this.errorMessage.message = "Se requiere minimo un producto";
        throw new Error('Error in products amount');
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
        if (further) {
          type = "F";
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
        } else {
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
        }
        let response = {};

        response = await productApi.update(formData, `type_connection=${type}`);
        await this.handleAlert(response, () => {
          Promise.all([
            this.setAttributes(type, source),
            this.setAttributes("L", "sLibrettoActivities"),
          ]);
        });
      }else{
        throw new Error('Error products fields');
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
        throw new Error('Server error');
      } else {
        this.alertMessageStore.show(true, "Proceso exitoso!");
        if (callback && typeof callback === "function") await callback();
      }
      this.loading = false;
    },
    updateAttributes(data, section) {
      if (section == "invoice") {
        this.editItem[data.key] = data.item;
      } else {
        this[section] = data;
      }
    },
    setRecords(item) {
      this.editItem = { ...this.editItem, ...item };
      this.stepperLabels[this.step].complete = true;
      this.step += 1;
    },
    // ------------------------ getting data from serve ----------
    async setAttributes(key, keyArray, furtherQuery = "") {
      const response = await invoiceApi.read(
        `invoice_id=${this.editItem.invoiceId}&attribute_key=${key}${furtherQuery}`
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
    async downloadPDF() {
      await invoiceApi.downloadPdf(this.editItem.invoiceId);
      // window.location.href = `http://127.0.0.1:8000/api/invoice-pdf?invoice_id=${this.editItem.invoiceId}`;
    },
    async setEditItem(invoiceId = null) {
      if (!this.idEditForm && !invoiceId) {
        this.editItem.services = [];
        this.editItem.taxes = [];
        return;
      }
      const id = this.idEditForm ?? invoiceId;
      const response = await invoiceApi.read(`invoice_id=${id}`);
      this.editItem = Object.assign(
        {},
        {
          invoiceId: response.data.id,
          note: response.data.note,
          date: response.data.date.split(" ")[0],
          seller: response.data.seller,
          client: response.data.client,
          payOff: response.data.planment.pay_off,
          startDate: response.data.planment.start_date,
          endDate: response.data.planment.end_date,
          stage: response.data.planment.stage,
          taxes: response.data.taxes || [],
        }
      );

      // ------------------updating keys of stepper to send reactive data ⚠️

      this.thirdKeyCard = this.thirdKeyCard + 1;
      this.test += 1;
    },
    mValidateEmtyObj(item) {
      return validateEmtyObj(item);
    },
  },
};
</script>
