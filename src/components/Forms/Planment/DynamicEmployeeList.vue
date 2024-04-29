<template>
  <v-row>
    <v-col cols="12">
      <strong class="text-caption d-block mb-2"
        >* <span class="text-overline">Campo dinamico. </span> Escribe entre 3 a
        5 letras para completar la busqueda...</strong
      >
      <div class="d-flex">
        <dynamic-select-field
          :options="options"
          @update:options="loadItems"
          @update:itemSelected="appendItem"
          mainLabel="fullname"
          :secondLabel="['identification']"
          title="Empleados"
          class="pr-5"
        >
        </dynamic-select-field>
      </div>
    </v-col>
    <v-col class="max-w-custom">
      <v-row v-if="records && records.length > 0">
        <v-col cols="12" md="6" v-for="record in records" :key="record.code">
          <v-card>
            <v-card-text>
              <v-row justify="end" justify-md="space-between">
                <v-col cols="12" sm="12" md="5" class="d-flex">
                  <v-btn
                    v-show="!editable"
                    icon="mdi-delete"
                    size="small"
                    color="warning"
                    variant="tonal"
                    @click="deleteItem(record)"
                  >
                  </v-btn>
                  <div class="pl-3">
                    <h6 class="text-h6">{{ record.fullname }}</h6>
                    <span
                      class="font-weight-regular text-blue-grey-lighten-2"
                      >{{ record.identification }}</span
                    >
                  </div>
                </v-col>
                <v-col cols="12" sm="12" md="5" xl="3">
                  <v-text-field
                    :maxlength="rulesValidation.price.maxLength"
                    label="Salario"
                    :rules="rulesValidation.price.rules"
                    :loading="loading"
                    append-inner-icon="mdi-cash"
                    v-model="record.salary"
                    variant="outlined"
                    :disabled="editable"
                    @change="checkInvoiceStepStore.handleUpdateInvoiceData()"
                    density="compact"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="12" md="4" xl="3">
                  <v-select
                    multiple
                    label="Cargo"
                    :rules="rulesValidation.select.rules"
                    :loading="loading"
                    :items="charges"
                    v-model="record.charges"
                    item-title="name"
                    variant="outlined"
                    :disabled="editable"
                    persistent-hint
                    @change="checkInvoiceStepStore.handleUpdateInvoiceData()"
                    density="compact"
                    return-object
                  >
                  </v-select>
                </v-col>
                <v-col cols="12" sm="12" md="4" xl="3">
                  <v-select
                    label="Metodo de pago"
                    :rules="rulesValidation.select.rules"
                    :loading="loading"
                    :items="paymentMethods"
                    v-model="record.payment_method_id"
                    item-title="name"
                    variant="outlined"
                    :disabled="editable"
                    persistent-hint
                    @change="checkInvoiceStepStore.handleUpdateInvoiceData()"
                    density="compact"
                    item-value="id"
                  >
                    <template v-slot:item="{ props, item }">
                      <v-list-item v-bind="props">
                        <v-list-item-subtitle
                          class="d-flex justify-space-between"
                        >
                          <span class="d-block">
                            {{ item.raw?.description }}</span
                          >
                        </v-list-item-subtitle>
                      </v-list-item>
                    </template>
                  </v-select>
                </v-col>
                <v-col cols="12" sm="12" md="4" xl="3">
                  <v-text-field
                    :maxlength="rulesValidation.text.maxLength"
                    label="Referencia"
                    :rules="rulesValidation.text.rules"
                    :loading="loading"
                    append-inner-icon="mdi-cash"
                    v-model="record.reference"
                    variant="outlined"
                    :disabled="editable"
                    @change="checkInvoiceStepStore.handleUpdateInvoiceData()"
                    density="compact"
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <div class="d-flex justify-center py-2">
                    <v-btn
                      variant="text"
                      :append-icon="
                        showDefaultPM ? 'mdi-chevron-up' : 'mdi-chevron-down'
                      "
                      size="small"
                      color="success"
                      @click="() => (showDefaultPM = !showDefaultPM)"
                    >
                      Metodos de pago prestablecidos
                    </v-btn>
                  </div>
                  <v-data-table
                    v-if="showDefaultPM"
                    :items="record.default_payment_methods"
                    :headers="headersPrePM"
                  >
                    <template v-slot:[`item.actions`]="{ item }">
                      <div>
                        <v-btn
                          icon="mdi-plus"
                          size="small"
                          color="primary"
                          variant="tonal"
                          @click="appendDefalutPM(item, record)"
                        >
                        </v-btn>
                      </div>
                    </template>
                  </v-data-table>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
  <div class="d-flex align-center">
    <strong class="text-overline d-block mt-3"
      >Impuestos seleccionados:
    </strong>
    <span class="text-primary d-block text-h5 pt-3 pl-3">{{
      records.length
    }}</span>
  </div>
  <span
    v-if="errorMessage.type && errorMessage.type == 'employees'"
    class="text-error text-caption"
  >
    {{ errorMessage.message }}
  </span>
</template>
<script>
import { RulesValidation } from "@/utils/validations";
import DynamicSelectField from "@/components/blocks/DynamicSelectField.vue";
import EmployeeApi from "@/services/Forms/EmployeeApi";
import { mapStores } from "pinia";
import { useCheckInvoiceStep } from "@/store/checkInvoiceStep";
import ChargeApi from "@/services/Forms/ChargeApi";
import PaymentMethodApi from "@/services/Forms/PaymentMethodApi";
const employeeApi = new EmployeeApi();
const chargeApi = new ChargeApi();
const paymentMethodApi = new PaymentMethodApi();
export default {
  props: {
    records: Array,
    errorMessage: Object,
    editable: Boolean,
  },
  components: {
    DynamicSelectField,
  },
  data: () => ({
    options: [],
    charges: [],
    paymentMethods: [],
    showDefaultPM: false,
    searchItem: "",
    loading: false,
    rulesValidation: RulesValidation,
    headersPrePM: [
      { title: "id", align: "start", sortable: false, key: "id" },
      {
        title: "Metodo de pago",
        align: "center",
        sortable: false,
        key: "name",
      },
      {
        title: "Referencia",
        align: "center",
        sortable: false,
        key: "reference",
      },
      { title: "Agregar", align: "center", sortable: false, key: "actions" },
    ],
  }),
  computed: {
    ...mapStores(useCheckInvoiceStep),
  },
  methods: {
    async loadItems(name = null) {
      const query = name
        ? `&filters[0][key]=third&filters[0][value]=${name}`
        : "";
      const response = await employeeApi.read(`format=short${query}`);
      this.options = response.data;
    },
    async setCharges(name = null) {
      const query = name
        ? `&filters[0][key]=name&filters[0][value]=${name}`
        : "";
      const response = await chargeApi.read(`format=short${query}`);
      this.charges = response.data;
    },
    async setPaymentMethods(name = null) {
      const query = name
        ? `&filters[0][key]=name&filters[0][value]=${name}`
        : "";
      const response = await paymentMethodApi.read(`format=short${query}`);
      this.paymentMethods = response.data;
    },
    appendItem(item) {
      const index = this.records.findIndex(function (objeto) {
        return objeto.id === item.id;
      });
      let newArray = this.records;
      if (index === -1) newArray.push(item);
      this.emitRecords(newArray);
    },
    appendDefalutPM(item, record) {
      record.payment_method_id = item.id;
      record.reference  = item.reference;
    },
    deleteItem(dropItem) {
      this.emitRecords(this.records.filter((item) => item.id != dropItem.id));
    },
    emitRecords(newRecords) {
      this.checkInvoiceStepStore.handleUpdateInvoiceData();
      this.$emit("update:records", newRecords);
    },
  },
  async mounted() {
    this.loading = true;
    try {
      await Promise.all([
        this.loadItems(),
        this.setCharges(),
        this.setPaymentMethods(),
      ]);
    } catch (error) {
      console.error("Alguna de las funciones falló:", error);
    }
    this.loading = false;
  },
};
</script>
<style>
.max-w-custom {
  max-height: 530px;
  overflow-y: scroll;
}
</style>
