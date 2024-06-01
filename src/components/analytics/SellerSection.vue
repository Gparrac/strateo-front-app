<template>
  <v-form ref="formSearchCustomer" class="d-flex mt-5 py-5 ">
  <h3 class="">Participación de clientes</h3>
  <v-spacer></v-spacer>

  <v-text-field
              type="text"
              variant="outlined"
              label="Busca un vendedor ..."
              :rules="rulesValidation.text.rules"
              v-model="keyword"
              density="compact"
              hint="Busca por nombre de vendedor o número de documento"
              persistent-hint

  ></v-text-field>

          <v-btn
              @click="searchData"
              icon="mdi-table-search"
              color="primary"
              class="ml-3"
              size="small"
              variant="tonal"
            >
            </v-btn>
</v-form>
  <v-row align-content="center" class="flex-row-reverse">
    <v-col cols="12" md="6">
      <v-data-table-server
        :headers="headers"
        :items="records"
        @update:options="loadItems"
        :items-length="totalRecords"
        v-model:items-per-page="recordsPerPage"
        :loading="loading"

        :items-per-page-options="[5]"
        return-object
        items-per-page-text="Items por Página"
      >
        <template v-slot:[`item.third`]="{ item }">
          <div>
            <span class="block text-subtitle-2">{{
              item?.third?.fullname
            }}</span
            ><br />
            <span class="block text-body-2 text-blue-grey-lighten-3">
              {{ item?.third?.fullid }}
            </span>
          </div>
        </template>
        <template v-slot:[`item.purchases`]="{ item }">
          <div>
            <v-chip variant="tonal" class="ma-1" label color="pink">
              {{ item.invoices_count }}
            </v-chip>
          </div>
        </template>
      </v-data-table-server>
    </v-col>
    <v-col cols="12" md="6">
      <div id="chart">
        <apexchart
        ref="chart"
          :id="keyChart"
          type="bar"
          height="350"
          :options="chartOptions"
          :series="series"
        ></apexchart>
      </div>
    </v-col>
  </v-row>
</template>
<script>
import AnalyticApi from "@/services/Forms/AnalyticApi";
import { useAnalyticDateStore } from "@/store/analyticDate";
import { RulesValidation } from "@/utils/validations";
import { mapActions, mapStores } from "pinia";
const analyticApi = new AnalyticApi();
export default {
  data: () => ({
    rulesValidation: RulesValidation,
    recordsPerPage: 5,
    totalRecords: 0,
    currentlyPage: 1,
    loading: false,
    keyword: "",
    headers: [
      {
        title: "ID",
        align: "start",
        key: "id",
        sortable: true,
      },
      { title: "Cliente", align: "start", key: "third", sortable: true },
      {
        title: "Nombre de usuario",
        align: "center",
        key: "name",
        sortable: true,
      },
      { title: "Compras", align: "end", key: "purchases", sortable: false },
    ],
    records: [],
    keyChart: 0,
    keySuscribeUpdate: 0,
    // chart Data
    series: [
      {
        name: "Compras de realizada",
        data: [], // invoice's amount by customer
      },
    ],
    chartOptions: {
      chart: {
        height: 350,
        type: "bar",
      },
      plotOptions: {
        bar: {
                borderRadius: 4,
                borderRadiusApplication: 'end',
                horizontal: true,
              }
      },
      dataLabels: {
        enabled: true,
        offsetY: -2,
        style: {
          fontSize: "12px",
          colors: ["#304758"],
        },
      },
      xaxis: {
        categories: [], // customer's names
        position: "top",
        axisBorder: {
          show: false,
        },
        axisTicks: {
          show: false,
        },
        crosshairs: {
          fill: {
            type: "gradient",
            gradient: {
              colorFrom: "#AD1457",
              colorTo: "#AD1457",
              stops: [0, 100],
              opacityFrom: 0.4,
              opacityTo: 0.5,
            },
          },
        },
        tooltip: {
          enabled: true,
        },
      },
      yaxis: {
        axisBorder: {
          show: false,
        },
        axisTicks: {
          show: false,
        },
        labels: {
          show: false,

        },
      },
      title: {
        text: "5 vendedores con más compras en este periodo",
        floating: true,
        offsetY: 330,
        align: "center",
        style: {
          color: "#444",
        },
      },
      colors:['#E91E63']
    },
  }),
  computed: {
    ...mapStores(useAnalyticDateStore),
  },
  methods: {
    ...mapActions(useAnalyticDateStore, ["$subscribe"]),
    async searchData(){
      this.loading = true;
      const { valid } = await this.$refs.formSearchCustomer.validate();
      if (!valid) {
        this.keyword = '';
      }
      await this.loadItems({page:1});
      this.loading = false;

    },
    async loadItems({
      page = this.currentlyPage,
      itemsPerPage = this.recordsPerPage,
    }, keyword = this.keyword) {
      this.loading = true;

      const castStartDate = this.analyticDateStore.castStart(true);
      const castEndDate = this.analyticDateStore.castStart(false);
      const params = new URLSearchParams();
      params.append("page", page);
      params.append("pagination", itemsPerPage);
      params.append("option", "LA");
      params.append("start_date", castStartDate);
      params.append("end_date", castEndDate);
      if(keyword && keyword.length > 0) params.append("keyword",keyword );
      const response = (await analyticApi.read("/seller", params.toString()))
        .data;

      if (response.data) {
        this.records = response.data;
      }
      this.keyword = keyword;
      this.currentlyPage = page;
      this.recordsPerPage = response.per_page;
      this.totalRecords = response.total;
      this.loading = false;
    },
    async setTopClients() {

      const castStartDate = this.analyticDateStore.castStart(true);
      const castEndDate = this.analyticDateStore.castStart(false);
      const query =`option=LS&end_date=${castEndDate}&start_date=${castStartDate}`;
      const response = (await analyticApi.read('/seller',query));
      if(response.data){
        this.series[0].data = response.data.invoices;
        this.chartOptions.xaxis.categories = response.data.customers;
      }else{
        this.series[0].data = [];
        this.chartOptions.xaxis.categories = [];
      }
      // this.$refs.chart.updateSeries(this.series);
      this.$refs.chart.updateOptions(this.chartOptions);
      // this.keyChart += 1;
    },
  },

  async mounted() {

    this.$subscribe(async (mutation, state) => {
      if (
        mutation.storeId == "analyticDate" &&
        state.keyUpdate != this.keySuscribeUpdate
      ) {
        this.keySuscribeUpdate = state.keyUpdate;
        await Promise.all([
          this.loadItems({ page: 1 }),
          this.setTopClients()
        ]);
      }
    });
    await this.setTopClients()
  },
};
</script>
