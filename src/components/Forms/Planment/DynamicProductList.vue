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
          mainLabel="name"
          :secondLabel="['consecutive']"
          title="Productos"
          subtitle="Consecutivo: "
          class="pr-5"
        >
        </dynamic-select-field>
      </div>
    </v-col>
    <v-col class="max-w-custom px-5">
      <v-row v-if="records && records.length > 0">
        <v-col cols="12" v-for="record in records" :key="record.code">
          <v-card
            :title="record.name"
            :subtitle="'Consecutivo: ' + record.consecutive"
            variant="outlined"
          >
            <template v-slot:prepend>
              <v-btn
                v-show="!editable"
                icon="mdi-delete"
                color="warning"
                variant="tonal"
                @click="deleteItem(record)"
              >
              </v-btn>
            </template>
            <template v-slot:append>
              <v-chip class="mx-2">{{ record.measure.symbol }}</v-chip>
              <v-chip class="mx-2">{{ record.brand.name }}</v-chip>
              <span class="text-overline">{{ record.product_code }}</span>
            </template>
            <v-card-text>
              <v-row>
                <v-col cols="12" md="6">
                  <v-row>
                    <v-col cols="12" md="6">
                      <v-checkbox
                        v-model="record.tracing"
                        color="primary"
                        label="Requiere inventario"
                        :value="1"
                        hide-details
                      ></v-checkbox>
                    </v-col>
                    <v-col cols="12">
                      <dynamic-select-field
                        v-if="record.tracing"
                        :options="warehouses"
                        :itemSaved="record.warehouse"
                        @update:options="setWarehouses"
                        @update:itemSelected="
                          (item) => setProductInventory(item, record)
                        "
                        mainLabel="address"
                        :secondLabel="['city', 'name']"
                        title="Bodega"
                        subtitle="Ciudad:"
                        :key="warehouses.length"
                      >
                      </dynamic-select-field>
                    </v-col>
                    <v-col cols="12" sm="6 ">
                      <v-text-field
                        :maxlength="rulesValidation.price.maxLength"
                        label="Costo"
                        :rules="rulesValidation.price.rules"
                        :loading="loading"
                        prepend-inner-icon="mdi-cash"
                        v-model="record.cost"
                        variant="outlined"
                        :disabled="editable"
                        persistent-hint
                        :hint="'Precio fijado: ' + record.defaultCost"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-text-field
                        class=""
                        :maxlength="rulesValidation.quantity.maxLength"
                        label="Cantidad"
                        :rules="[...rulesValidation.quantity.rules]"
                        :loading="loading"
                        variant="outlined"
                        v-model="record.amount"
                        :disabled="editable"
                        persistent-hint
                        :hint="
                          record.tracing && record.warehouse
                            ? 'Stock actual: ' + record.stock
                            : ''
                        "
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="12">
                      <v-text-field
                        :maxlength="rulesValidation.price.maxLength"
                        label="Descuento"
                        :rules="rulesValidation.optionalPrice.rules"
                        :loading="loading"
                        prepend-inner-icon="mdi-cash"
                        v-model="record.discount"
                        variant="outlined"
                        :disabled="editable"
                        persistent-hint
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </v-col>
                <v-col cols="12" md="6">
                  <v-row>
                    <v-col cols="12">
                      <dynamic-tax-list
                        :records="record.taxes"
                        :editable="editable"
                        :errorMessage="{}"
                        @update:records="(item) => (record.taxes = item)"
                      ></dynamic-tax-list>
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>
              <div class="d-flex row-reverse justify-end">
                <div>
                  <h3 class="text-h5 font-weight-light text-center">
                    {{
                      netTotal(
                        record.taxes,
                        record.discount,
                        record.amount,
                        record.cost
                      ) || '-'
                    }}
                  </h3>
                  <h4 class="text-subtitle-2 text-right font-weight-light">
                    Costo neto
                  </h4>
                </div>
                <div class="pl-5">
                  <h3 class="text-h5 font-weight-light text-center">
                    {{ totalCost(record.amount, record.cost) || '-'}}
                  </h3>
                  <h4 class="text-subtitle-2 text-right font-weight-light">
                    Costo total
                  </h4>
                </div>
                <div class="pl-5">
                  <h3 class="text-h5 font-weight-light text-center">
                    {{
                      totalDiscount(
                        record.taxes,
                        record.discount,
                        record.amount,
                        record.cost
                      ) || '-'
                    }}
                  </h3>
                  <h4 class="text-subtitle-2 text-right font-weight-light">
                    Descuento
                  </h4>
                </div>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
  <div class="d-flex align-center">
    <strong class="text-overline d-block mt-3"
      >Total de productos seleccionados:
    </strong>
    <span class="text-primary d-block text-h5 pt-3 pl-3">{{
      records.length
    }}</span>
  </div>
  <span
    v-if="errorMessage.type && errorMessage.type == 'products'"
    class="text-error text-caption"
  >
    {{ errorMessage.message }}
  </span>
</template>
<script>
import { RulesValidation } from "@/utils/validations";
import ProductApi from "@/services/Forms/ProductApi";
import WarehouseApi from "@/services/Forms/WarehouseApi";
import DynamicSelectField from "@/components/blocks/DynamicSelectField.vue";
import DynamicTaxList from "./DynamicTaxList.vue";
import InventoryApi from "@/services/Forms/InventoryApi";
const productApi = new ProductApi();
const warehouseApi = new WarehouseApi();
const inventoryApi = new InventoryApi();
export default {
  props: {
    records: Array,
    errorMessage: Object,
    editable: Boolean,
  },
  components: {
    DynamicSelectField,
    DynamicTaxList,
  },
  data: () => ({
    options: [],
    loading: false,
    rulesValidation: RulesValidation,
    warehouses: [],
  }),

  methods: {
    totalCost(amount, cost) {
      const tamount = amount ?? 0;
      const tcost = cost ?? 0;
      return ((+tamount ?? 0) * +tcost).toFixed(2);
    },
    totalDiscount(taxes, discount, amount, cost) {
      const tDiscount = +(discount ?? 0);
      const totalPercentTaxes =
        taxes.reduce((total, item) => total + (+item.percent ?? 0), 0) ?? 0;
      const tTotalcost = +this.totalCost(amount, cost);

      return (tDiscount + (totalPercentTaxes * tTotalcost) / 100).toFixed(2);
    },
    netTotal(taxes, discount, amount, cost) {
      const tDiscount = this.totalDiscount(taxes, discount, amount, cost);
      const tTotalCost = this.totalCost(amount, cost);
      return (tTotalCost - tDiscount).toFixed(2);
    },
    async setProductInventory(item, product) {
      product.warehouse = item;
      product.stock = (
        await inventoryApi.read(
          `product_id=${product.id}&warehouse_id=${item.id}`
        )
      ).data;
    },
    async loadItems(name = null) {
      let query = `types[0]=T&format=short&`;
      query = query + (name ? `keyword=${name}&typeKeyword=name` : "");

      const response = await productApi.read(query);
      this.options = response.data;
    },
    async setWarehouses(name = null) {
      const query = name ? `&name=${name}` : "";
      this.warehouses = (await warehouseApi.read(`format=short&${query}`)).data;
    },
    appendItem(item) {
      const index = this.records.findIndex(function (objeto) {
        return objeto.id === item.id;
      });
      let newArray = this.records;
      if (index === -1) newArray.push(item);
      this.emitRecords(newArray);
    },
    deleteItem(itemSelected) {
      this.emitRecords(
        this.records.filter((item) => item.id != itemSelected.id)
      );
    },
    emitRecords(newRecords) {
      this.$emit("update:records", newRecords);
    },
  },
  async mounted() {
    this.loading = true;
    try {
      await Promise.all([this.loadItems(), this.setWarehouses()]);
    } catch (error) {
      console.error("Alguna de las funciones falló:", error);
    }
    this.loading = false;
  },
};
</script>
<style scoped>
.max-w-custom {
  max-height: 430px;
  overflow-y: scroll;
}
</style>
