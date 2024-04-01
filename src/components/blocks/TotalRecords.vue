<template>
              <div class="d-flex row-reverse justify-end">
                <div>
                <h3 class="text-h5 font-weight-light text-center">
                  {{netTotal(record) || '-'}}
                </h3>
                <h4 class="text-subtitle-2 text-right font-weight-light">
                  Precio neto
                </h4>
              </div>
              <div class="pl-5">
                <h3 class="text-h5 font-weight-light text-center">
                  {{totalCost(record) || '-'}}
                </h3>
                <h4 class="text-subtitle-2 text-right font-weight-light">
                  Precio total
                </h4>
              </div>
              <div class="pl-5">
                <h3 class="text-h5 font-weight-light text-center">
                  {{totalTaxes(record) || '-'}}
                </h3>
                <h4 class="text-subtitle-2 text-right font-weight-light">
                  Impuestos
                </h4>
              </div>
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
     const tamount = record.amount ?? 0;
     const tcost = record.cost ?? 0;
     const tDiscount = +(record.discount ?? 0);
     record.ctotal = (+tamount ?? 0) * tcost - tDiscount;
     return formatNumberToColPesos(record.ctotal);
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
