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
            :showPlanment="true"
          ></invoice-field-group>
        </v-form>
      </v-stepper-window-item>
      <v-stepper-window-item :value="1">
        <v-form ref="formProduct">
          <dynamic-service-list
            :records="products"
            :errorMessage="errorMessage"
            :editable="false"
            @update:records="(item) => (products = item)"
          ></dynamic-service-list>
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
      <v-stepper-window-item :value="3">
        <v-form ref="formLibrettoActivity">
          <dynamic-libretto-activity-list
            :records="librettoActivities"
            :serviceRelatedRecords="sLibrettoActivities"
            :errorMessage="errorMessage"
            :editable="false"
            @update:records="(item) => (librettoActivities = item)"
          ></dynamic-libretto-activity-list>
        </v-form>
      </v-stepper-window-item>
      <v-stepper-window-item :value="4">
        <v-form ref="formEmployee">
          <dynamic-employee-list
            :records="employees"
            :errorMessage="errorMessage"
            :editable="false"
            @update:records="(item) => (employees = item)"
          >
            ></dynamic-employee-list
          >
        </v-form>
      </v-stepper-window-item>
    </v-stepper-window>
    <!-- --------------------------- invoice data -------------------->

    <!-- --------------------------- end invoice data -------------------->
    <template v-slot:[`actions`]>
      <div class="d-flex justify-start px-4">
        <div class="mx-4">
          <h3 class="text-h5 font-weight text-center text-primary">
            {{ netTotal }}
          </h3>
          <h4 class="text-subtitle-2 text-right font-weight-light">
            Costo neto
          </h4>
        </div>
        <div class="pl-5">
          <h3 class="text-h5 font-weight text-center text-green">
            {{ calTotalCost() }}
          </h3>
          <h4 class="text-subtitle-2 text-right font-weight-light">
            Costo total
          </h4>
        </div>
        <div class="pl-5">
          <h3 class="text-h5 font-weight text-center text-orange">
            {{ calTotalDiscount() }}
          </h3>
          <h4 class="text-subtitle-2 text-right font-weight-light">
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
import { castFullDate, statusAllowed, calTotalCostItems, calTotalDiscountItems, formatNumberToColPesos } from "@/utils/cast";
//import dynamicFieldList from "@/components/Forms/Service/dynamicFieldList.vue";
import InvoiceFieldGroup from "@/components/blocks/InvoiceFieldGroup.vue";
import DynamicProductList from "./DynamicProductList.vue";
import DynamicEmployeeList from "./DynamicEmployeeList.vue";
import DynamicServiceList from "./DynamicServiceList.vue";
import DynamicLibrettoActivityList from "./DynamicLibrettoActivityList.vue";
import ProductApi from "@/services/Forms/ProductApi";
import EmployeeApi from "@/services/Forms/EmployeeApi";
import LibrettoActivityApi from "@/services/Forms/LibrettoActivityApi";
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
    DynamicProductList,
    DynamicEmployeeList,
    DynamicServiceList,
    DynamicLibrettoActivityList
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
      { label: "Adicionales", complete: false },
      { label: "Libreto de actividades", complete: false },
      { label: "Empleados", complete: false },
    ],

    //data
    products: [],
    employees: [],
    furtherProducts: [],
    librettoActivities: [],
    sLibrettoActivities: [],
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
          this.setAttributes("E", "products"),
          this.setAttributes("F", "furtherProducts"),
          this.setAttributes("W", "employees"),
          this.setAttributes("L", "librettoActivies"),
          this.setAttributes("L", "sLibrettoActivities",'&type_service=S'),
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
    netTotal(){
      console.log('this',this.totalCost, this.totalDiscount, this.editItem.furtherDiscount)
      return formatNumberToColPesos(this.totalCost -this.totalDiscount - (this.editItem.furtherDiscount || 0));
    },
    ...mapStores(useAlertMessageStore),
  },
  methods: {
    // methods to cal total amounts
    calTotalCost() {
      const totalServices = calTotalCostItems(this.products);
      const totalFurtherProducts = calTotalCostItems(this.furtherProducts)
      this.totalCost = totalServices + totalFurtherProducts;
      return formatNumberToColPesos(this.totalCost);
    },
    calTotalDiscount() {
      this.totalDiscount = calTotalDiscountItems(this.products) + calTotalDiscountItems(this.furtherProducts);
      return formatNumberToColPesos( this.totalDiscount) ;
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
          this.saveProducts(formData, undefined);
          break;
        case 2:
          this.saveProducts(formData, true);
          break;
          case 3:
          this.saveLibrettoActivies(formData, true);
          break;
        case 4:
          this.saveEmployees(formData);
          break;
        default:
          break;
      }
      this.loading = false;
    },
    async saveLibrettoActivies(formData){
      const { valid } = await this.$refs.formLibrettoActivity.validate();
      if (this.librettoActivities.length == 0) {
        this.errorMessage.type = "librettoActivities";
        this.errorMessage.message = "Se requiere minimo una actividad";

      } else {
        this.errorMessage = {};
        if (valid) {
        formData.append("invoice_id", this.editItem.invoiceId);
        this.librettoActivities.forEach((la, eindex) => {
          formData.append(`libretto_activities[${eindex}][libretto_activity_id]`, la.id);
          formData.append(`libretto_activities[${eindex}][description]`, la.description);
          formData.append(`libretto_activities[${eindex}][order]`, eindex);
        });
        const response = await librettoActivityApi.update(
          formData,
          "type_connection=I"
        );
        this.handleAlert(response, this.setAttributes("L", "librettoActivities"));
      }
      }

    },
    async saveEmployees(formData) {
      const { valid } = await this.$refs.formEmployee.validate();
      if (this.employees.length == 0) {
        this.errorMessage.type = "employees";
        this.errorMessage.message = "Se requiere minimo un empleado";
        return;
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
      }
    },
    async saveInvoice(formData) {
      const { valid } = await this.$refs.formInvoice.validate();
      if (valid) {
        formData.append("client_id", this.editItem.client.id);
        formData.append("further_discount", this.editItem.furtherDiscount);
        if(this.note && this.note.length > 0) formData.append("note", this.editItem.note);
        formData.append("seller_id", this.editItem.seller.id);
        formData.append("date", castFullDate(this.editItem.date));
        formData.append("start_date", castFullDate(this.editItem.startDate));
        formData.append("end_date", castFullDate(this.editItem.endDate));
        formData.append("pay_off", this.editItem.payOff);
        formData.append("stage", this.editItem.stage.id);

        let response = {};
        if (this.editItem.invoiceId) {
          formData.append("invoice_id", this.editItem.invoiceId);
          response = await invoiceApi.update(formData);
        } else {
          formData.append("sale_type", "E");
          response = await invoiceApi.create(formData);
        }
        this.handleAlert(response, this.setEditItem(response.data));
      }
    },
    async saveProducts(formData, further = false) {
      //validate form rules 🚥
      const { valid } = await this.$refs[
        further ? "formFurtherProduct" : "formProduct"
      ].validate();
      //validate dynamic components 🚥
      if (
        (this.step == 1 && this.products.length == 0) ||
        (this.step == 2 && this.furtherProducts.length == 0)
      ) {
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
        if (further) {
          type = "F";
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
        } else {
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
        }
        let response = {};

        response = await productApi.update(formData, `type_connection=${type}`);
        this.handleAlert(response, () => {
          Promise.all([
            this.setAttributes(type, source),
            this.setAttributes('L', 'sLibrettoActivities'),
          ])
        });
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
    async setAttributes(key, keyArray, furtherQuery = '') {
      const response = await invoiceApi.read(
        `invoice_id=${this.editItem.invoiceId}&attribute_key=${key}${furtherQuery}`
      );

      this[keyArray] = response.data ?? [];
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
          payOff: response.data.planment.pay_off,
          startDate: response.data.planment.start_date,
          endDate: response.data.planment.end_date,
          stage: response.data.planment.stage,
        }
      );

      // ------------------updating keys of stepper to send reactive data ⚠️

      this.thirdKeyCard = this.thirdKeyCard + 1;
      this.test = this.test + 1;
    },
  },
};
</script>
