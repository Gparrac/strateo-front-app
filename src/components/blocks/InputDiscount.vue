<template>
  <!-- this could be wrapped in a different componente to reuse it 🔦 -->
  <v-divider class="pb-4" :thickness="3"></v-divider>
  <span>Descuento:</span>
  <v-row>
    <v-col cols="12" sm="3">
      <v-switch
        v-on:update:model-value="$emit('update:itemKindDiscount', $event)"
        :model-value="item.kindDiscount"
        hide-details
        density="compact"
        color="orange"
        @change="resetDiscounts(item)"
      >
        <template v-slot:label>
          <v-icon
            :icon="item.kindDiscount ? 'mdi-brightness-percent' : 'mdi-cash'"
          ></v-icon>
        </template>
      </v-switch>
    </v-col>
    <v-col cols="12" sm="9">
      <v-text-field
        v-if="item.kindDiscount"
        :maxlength="rulesValidation.percent.maxLength"
        label="Porcentaje"
        :rules="rulesValidation.percent.rules"
        :loading="loading"
        v-on:update:model-value="$emit('update:itemDiscountPercent', $event)"
        :model-value="item.discountPercent"
        variant="outlined"
        :disabled="editable"
        density="compact"
        persistent-hint
        :hint="formatNumberToColPesos(item.discount)"
      ></v-text-field>
      <v-text-field
        v-else
        :maxlength="rulesValidation.price.maxLength"
        label="Cantidad"
        :rules="rulesValidation.optionalPrice.rules"
        :loading="loading"
        v-on:update:model-value="$emit('update:itemDiscount', $event)"
        :model-value="item.discount"
        variant="outlined"
        :disabled="editable"
        @change="checkInvoiceStepStore.handleUpdateInvoiceData()"
        density="compact"
        persistent-hint
      ></v-text-field>
    </v-col>
  </v-row>
</template>
<script>
import { mapStores } from "pinia";
import { useCheckInvoiceStep } from "@/store/checkInvoiceStep";
import { RulesValidation } from "@/utils/validations";
import { formatNumberToColPesos } from "@/utils/cast";
export default {
  props: {
    item: Object,
    loading: Boolean,
    editable: Boolean
  },
  computed: {
    ...mapStores(useCheckInvoiceStep),
  },
  data: () => ({
    rulesValidation: RulesValidation,
  }),
  methods:{
    resetDiscounts(item){
      item.discount = 0
      item.discountPercent = 0
      console.log('after switch', item)
    },
    formatNumberToColPesos(item){
      return formatNumberToColPesos(item)
    },
  }
};
</script>
