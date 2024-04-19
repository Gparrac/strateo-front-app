<template>
  <v-row class="">
    <v-col cols="12" lg="7">
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
          :secondLabel="['description']"
          title="Libreto de actividades"
          class="pr-5"
        >
        </dynamic-select-field>
      </div>
      <div class="max-h-custom px-5 w-100">
        <v-row v-if="records && records.length > 0">
          <v-col
            cols="12"
            v-for="(record, i) in records"
            :key="`${record.code}-${i}`"
          >
            <v-card :title="`${i+1} - ${record.name}`" variant="outlined">
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

              <v-card-text>
                <v-row justify="center">
                  <v-col cols="6" class="ma-0">
                    <file-field
                      class="mx-0 px-0"
                      title="Material adicional"
                      :item="record"
                      :loading="loading"
                      @update:pathfile="(item) => (record.pathFile = item)"
                      @update:file="(item) => (record.file = item)"
                    ></file-field>
                  </v-col>
                  <v-col cols="12">
                    <v-textarea
                      label="Observaciones"
                      variant="outlined"
                      :maxLength="rulesValidation.longTextNull.maxLength"
                      :rules="rulesValidation.longTextNull.rules"
                      v-model="record.description"
                      :loading="loading"
                      rows="2"
                    ></v-textarea>
                  </v-col>
                </v-row>
              </v-card-text>
              <template v-slot:append>
                <v-btn
                  class="mx-2"
                  v-show="!editable"
                  icon="mdi-chevron-down"
                  size="small"
                  color="success"
                  variant="tonal"
                  @click="pullDown(i)"
                >
                </v-btn>
                <v-btn
                  v-show="!editable"
                  icon="mdi-chevron-up"
                  size="small"
                  color="success"
                  variant="tonal"
                  @click="pushUp(i)"
                >
                </v-btn>
              </template>
            </v-card>
          </v-col>
        </v-row>
      </div>
    </v-col>
    <v-col cols="12" lg="5" class="pr-5 pt-4">
      <v-card
        title="Actividades preseleccionadas"
        subtitle="Actividades que han sido parametrizadas segun los servicios que has escodigo para esta planeación"
        elevation="3"
      >
        <v-card-text>
          <v-data-table :items="serviceRelatedRecords" :headers="headersPreLA">
            <template v-slot:[`item.actions`]="{ item }">
              <div>
                <v-btn
                  icon="mdi-plus"
                  size="small"
                  color="primary"
                  variant="tonal"
                  @click="appendItem(item)"
                >
                </v-btn>
              </div>
            </template>
          </v-data-table>
        </v-card-text>
      </v-card>
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
import LibrettoActivityApi from "@/services/Forms/LibrettoActivityApi";
import DynamicSelectField from "@/components/blocks/DynamicSelectField.vue";
import { deepCopy } from "@/utils/cast";
import FileField from "@/components/blocks/FileField.vue";

const librettoActivityApi = new LibrettoActivityApi();

export default {
  props: {
    records: Array,
    serviceRelatedRecords: Array,
    errorMessage: Object,
    editable: Boolean,
  },
  components: {
    DynamicSelectField,
    FileField,
  },

  data: () => ({
    options: [],
    testOptions: [1],
    loading: false,
    rulesValidation: RulesValidation,
    headersPreLA: [
      { title: "id", align: "start", sortable: false, key: "id" },
      { title: "Actividad", align: "center", sortable: false, key: "name" },
      { title: "Servicio", align: "center", sortable: false, key: "service" },
      { title: "Agregar", align: "center", sortable: false, key: "actions" },
    ],
  }),
  computed: {
    recordIds() {
      return this.records.map((item) => item.id);
    },
  },
  methods: {
    async loadItems(name = null) {
      const query = name
        ? `&filters[0][key]=name&filters[0][value]=${name}`
        : "";
      const response = await librettoActivityApi.read(`format=short${query}`);
      this.options = response.data;
    },
    appendItem(item) {
      item.pathFile = item.path_file;
      let localRecords = deepCopy(this.records);
      localRecords.push(item);
      this.emitRecords(localRecords);
    },
    deleteItem(index) {
      this.emitRecords(this.records.filter((item, i) => i != index));
    },
    pushUp(index) {
      if (index >= this.records.length - 1) {
        let tempRecords = deepCopy(this.records);
        const temp = tempRecords[index];
        tempRecords[index] = tempRecords[index - 1];
        tempRecords[index - 1] = temp;
        this.emitRecords(tempRecords);
      }
    },
    pullDown(index) {
      if (index < this.records.length - 1) {
        let tempRecords = deepCopy(this.records);
        const temp = tempRecords[index];
        tempRecords[index] = tempRecords[index + 1];
        tempRecords[index + 1] = temp;
        this.emitRecords(tempRecords);
      }
    },
    emitRecords(newRecords) {
      this.$emit("update:records", newRecords);
    },
  },
  async mounted() {
    this.loading = true;
    try {
      await Promise.all([this.loadItems()]);
    } catch (error) {
      console.error("Alguna de las funciones falló:", error);
    }
    this.loading = false;
  },
};
</script>
<style scoped>
.max-h-custom {
  max-height: 430px;
  overflow-y: scroll;
}
</style>
