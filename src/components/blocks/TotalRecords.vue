<template>
          <div>
            <h6 class="text-subtitle-1 text-end">
              {{ totalCost(record) }}</h6>
            <span
              class="d-block text-end font-weight-regular text-blue-grey-lighten-3"
            >
              Subtotal</span
            >
          </div>
          <div>
            <h6 class="text-subtitle-1 text-end">
              {{ totalTaxes(record) }}
            </h6>
            <span
              class="d-block text-end font-weight-regular text-blue-grey-lighten-3"
            >
              Impuestos</span
            >
          </div>
          <div>
            <h6 class="text-subtitle-1 text-end">
              {{ netTotal(record) }}
            </h6>
            <span
              class="d-block text-end font-weight-regular text-blue-grey-lighten-3"
            >
              Neto</span
            >
          </div>

</template>
<script>
import { formatNumberToColPesos } from '@/utils/cast';

export default {
  props: {
    record: Object,
  },
  methods:{
    totalCost(record){
      console.log('cal total')
     const tamount = +(record.amount ?? 0);
     const tcost = +(record.cost ?? 0);
     const tDiscount = this.calculatePercent(tcost, tamount, record);

      console.log('total', tDiscount , record)
     record.ctotal = tamount * tcost - tDiscount;
     return formatNumberToColPesos(record.ctotal);
    },
    calculatePercent(total, amount, record){
      if(record.kindDiscount){
        record.discount = (+(record.discountPercent ?? 0)) * amount * total / 100
      }else{
        record.discount = +(record.discount ?? 0)
      }
      return record.discount
    },
    totalTaxes(record){
      const totalTaxes = record.taxes.reduce((total, item) => {
        const totalTax = (item.type == 'D' ? -1 : 1 ) * (item.percent || 0)*record.ctotal/100 ?? 0;
        return total + (+totalTax);
      }, 0) ?? 0;
      record.ctaxes = totalTaxes;
      return formatNumberToColPesos( record.ctaxes);
    },
    netTotal(record){
      const tDiscount = record.ctaxes;
      const tTotalCost = record.ctotal;
      return formatNumberToColPesos(tTotalCost - tDiscount);
    },
  }
};
</script>
