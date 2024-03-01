<template>
  <v-row>
    <v-col cols="12">
      <strong class="text-caption d-block mb-2"
        >* <span class="text-overline">Campo dinamico  </span> Escribe entre 3 a
        5 letras para completar la busqueda y llena los campos correspondientes de tu selección...</strong
      >
      <div class="d-flex">
        <v-autocomplete
          label="Campos adicionales"
          v-model="itemSelected"
          :items="options"
          class="flex-grow-1 mr-5"
          v-model:search="searchItem"
          item-title="name"
          :return-object="true"
          :loading="loading"
        >
          <template v-slot:item="{ props, item }">
            <v-list-item v-bind="props">
              <v-list-item-subtitle class="d-flex">
                <span class="d-block">{{ item.raw.description }}</span>
              </v-list-item-subtitle>
            </v-list-item>
          </template>
        </v-autocomplete>
        <v-btn
          icon="mdi-plus-circle"
          color="primary"
          variant="tonal"
          class="mr-3"
          :disabled="itemSelected ? false : true"
          @click="appendItem"
        >
        </v-btn>
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
                  cols="12" lg="6"
                >
                  <div v-if="field.type.id == 'F'" class="d-flex">
                    <v-file-input
                      class="w-75"
                      v-model="record.fields[findex].data"
                      accept=".doc, .docx, .pdf"
                      label="Registro Comercial"
                      :rules="field.rules"
                      :loading="loading"
                      @change="handleFileFields($event, field)"
                    ></v-file-input>
                    <div class="w-25 px-5" v-if="!record.fields[findex].data && !record.fields[findex].pathFile">
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
                  <div v-else >
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
  <span v-if="errorMessage.type && errorMessage.type == 'services'" class="text-error text-caption">
  {{ errorMessage.message }}
  </span>
</template>
<script>
import { RulesValidation } from "@/utils/validations";
import ServiceApi from "@/services/Forms/ServiceApi";
const serviceApi = new ServiceApi();
const fieldText = [
(value) =>
        (value && value.length >= 3) ||
        "Este campo debe de ser de almenos 3 caracteres",
];
const fieldFile = [
(value) =>
        !value ||
        !value.length ||
        value[0].size < 2000000 ||
        "La imagen debe pesar menos de 2 MB",
];
export default {
  props: {
    records: Array,
    errorMessage: Object
  },
  data: () => ({
    itemSelected: null,
    options: [],
    searchItem: "",
    loading:false,
    rulesValidation: RulesValidation,
  }),
  watch: {
    async searchItem(to) {
      if (to.length > 3 && to.length < 5) {
        this.loadItems(to);
      }
    },
  },
  methods: {
    async loadItems(name = null) {
      const query = name
        ? `keyword=${name}&typeKeyword=name&format=short`
        : "format=short";
      this.options = (await serviceApi.read(query)).data;
    },
    appendItem() {
      this.addRules(this.itemSelected.fields)
      this.emitRecords([this.itemSelected, ...this.records]);
      this.itemSelected = null;
    },
    addRules(items){
      items.forEach(item => {
        switch (item.type.id) {
          case 'T':
            item.rules = fieldText;
            break;
          case 'F':
            item.rules = fieldFile;
            break;
          default:
            break;
        }
        if (item.required == 1) item.rules = [(value) => !!value || "Este campo es requerido es requerida",...item.rules];
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
    handleFileFields(event, item){
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
    if(this.records && this.records.length > 0 )
    this.records.map( item => {
      this.addRules(item.fields);
  })
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
