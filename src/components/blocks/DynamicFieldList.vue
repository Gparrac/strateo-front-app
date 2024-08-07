<template>
  <v-row>
    <v-col cols="12">
      <strong class="text-caption d-block mb-2"
        >* <span class="text-overline">Campo dinamico </span> Escribe entre 3 a
        5 letras para completar la busqueda y llena los campos correspondientes
        de tu selección...</strong
      >
      <div class="d-flex">
        <dynamic-select-field
          :options="options"
          @update:options="loadItems"
          @update:itemSelected="appendItem"
          mainLabel="name"
          :secondLabel="['description']"
          title="Servicios adicionales"
        >
        </dynamic-select-field>
      </div>
    </v-col>
    <v-col class="max-w-custom">
      <v-row v-if="records && records.length > 0">
        <v-col cols="12" v-for="record in records" :key="record.code">
          <v-card :title="record.name" :subtitle="record.description">
            <template v-slot:prepend>
              <v-btn
                icon="mdi-delete"
                color="warning"
                variant="tonal"
                @click="deleteItem(record)"
              >
              </v-btn>
            </template>
            <v-card-text>
              <h4 class="text-center pb-3 text-overline">
                Campos relacionados
              </h4>
              <v-row v-if="record.fields && record.fields.length > 0">
                <v-col
                  v-for="(field, findex) in record.fields"
                  :key="field.id + '-field'"
                  cols="12"
                  lg="6"
                >
                  <div v-if="field.type.id == 'F'" class="d-flex">
                    <v-file-input
                      class="w-75"
                      v-model="record.fields[findex].data"
                      accept=".doc, .docx, .pdf"
                      :label="field.name"
                      :rules="field.rules"
                      :loading="loading"
                      variant="outlined"
                      @change="handleFileFields($event, field)"
                    ></v-file-input>
                    <div
                      class="w-25 px-5"
                      v-if="
                        !record.fields[findex].data &&
                        !record.fields[findex].pathFile
                      "
                    >
                      <h3 class="text-center">No hay archivo seleccionado</h3>
                    </div>
                    <div v-else>
                      <v-btn
                        class="ma-2"
                        outlined
                        :href="getFileUrl(field.pathFile)"
                        target="_blank"
                        icon="mdi-folder-download"
                        size="small"
                        download
                      >
                      </v-btn>
                    </div>
                  </div>
                  <div v-else>
                    <v-text-field
                      :maxlength="field.length"
                      :label="field.name"
                      :rules="field.rules"
                      :loading="loading"
                      :prepend-inner-icon="field.type.icon"
                      v-model="record.fields[findex].data"
                    ></v-text-field>
                  </div>
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
      >Total de registros seleccionados:
    </strong>
    <span class="text-primary d-block text-h5 pt-3 pl-3">{{
      records.length
    }}</span>
  </div>
  <span
    v-if="errorMessage.type && errorMessage.type == 'services'"
    class="text-error text-caption"
  >
    {{ errorMessage.message }}
  </span>
</template>
<script>
import { RulesValidation } from "@/utils/validations";
import ServiceApi from "@/services/Forms/ServiceApi";
import DynamicSelectField from "./DynamicSelectField.vue";
const serviceApi = new ServiceApi();
const fieldText = (length) => [
  (value) =>
    (value && value.length >= 3) ||
    "Este campo debe de ser de almenos 3 caracteres",
  (value) => value.length < length || `Tamaño maximo de ${length} caracteres`,
  (value) => /^[a-zA-Z]+$/.test(value) || "Ingrese solo letras",
];
const fieldFile = [
  (value) =>
    !value ||
    !value.length ||
    value[0].size < 2000000 ||
    "La imagen debe pesar menos de 2 MB",
];
const fieldNumeric = (length) => [
  (value) =>
    !!value ||
    (!isNaN(parseFloat(value)) && isFinite(value)) ||
    typeof value == "number" ||
    "La cantidad debe ser de tipo númerica",
  (value) =>
    (value < length && value >= 0) ||
    "Rango de cantidad no valida (0 - 99999999)",
];

export default {
  props: {
    records: Array,
    errorMessage: Object,
  },
  components: {
    DynamicSelectField,
  },
  data: () => ({
    options: [],
    searchItem: "",
    loading: false,
    rulesValidation: RulesValidation,
  }),
  methods: {
    async loadItems(name = null) {
      const query = name
        ? `filters[0][key]=name&filters[0][value]=${name}&format=short`
        : "format=short";
      this.options = (await serviceApi.read(query)).data;
    },
    appendItem(item) {
      this.addRules(item.fields);
      const index = this.records.findIndex(function (objeto) {
        return objeto.id === item.id;
      });
      let newArray = this.records;
      if (index === -1) newArray.push(item);
      this.emitRecords(newArray);
    },
    addRules(items) {
      items.forEach((item) => {
        if (item.type.id == "F") {
          item.rules = fieldFile;
          if (item.required == 1 && !item.pathFile)
            item.rules = [
              (value) => !!value || "Este campo es requerido",
              ...item.rules,
            ];
        } else {
          if (item.type.id == "T") {
            item.rules = fieldText(item.length);
          } else if (item.type.id == "N") {
            item.rules = fieldNumeric(item.length);
          }
          if (item.required == 1)
            item.rules = [
              (value) => !!value || "Este campo es requerido",
              ...item.rules,
            ];
        }
      });
    },
    deleteItem(itemSelected) {
      this.emitRecords(
        this.records.filter((item) => item.id != itemSelected.id)
      );
    },
    emitRecords(newRecords) {
      this.$emit("update:records", newRecords);
    },
    handleFileFields(event, item) {
      const files = event.target.files;
      if (files.length > 0) {
        const selectedFile = files[0];
        item.pathFile = selectedFile;
        this.$emit(item);
      }
    },
    getFileUrl(file) {
      if (!file) return "";
      if (typeof file === "string") return file;
      if (typeof file === "object") return URL.createObjectURL(file);
      return;
    },
  },
  async mounted() {
    if (this.records && this.records.length > 0)
      this.records.map((item) => {
        this.addRules(item.fields);
      });
    await this.loadItems();
  },
};
</script>
<style>
.max-w-custom {
  max-height: 310px;
  overflow-y: scroll;
}
</style>
