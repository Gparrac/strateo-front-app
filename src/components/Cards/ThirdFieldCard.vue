<template>
  <v-card rounded="true" elevation="0" title="Datos personales">
    <v-card-text>
      <!-- Business Name or normal name -->
      <v-row>
        <v-col cols="12" sm="4">
          <v-select
            label="Tipo de documento"
            item-title="label"
            item-value="name"
            :items="typesDocument"
            :rules="rulesValidation.select.rules"
            :loading="loading"
            :model-value="records.typeDocument"
            @update:model-value="(value) => changeTypeDoc(value)"
            variant="outlined"
          ></v-select>
        </v-col>
        <v-col cols="12" sm="4">
          <v-text-field
            :maxlength="rulesValidation.identification.maxLength"
            label="Número de documento"
            :model-value="records.identification"
            :rules="dynamicIdRule"
            :loading="loading"
            :suffix="verificationNitNumber"
            @update:model-value="
              (value) => emitRecords(value, 'identification')
            "
            variant="outlined"
          ></v-text-field>
        </v-col>
        <template
          v-if="
            (records.typeDocument && records.typeDocument != 'NIT') ||
            this.thirdPerson
          "
        >
          <v-col cols="12" sm="4">
            <v-text-field
              :maxlength="rulesValidation.justText.maxLength"
              label="Nombres"
              :model-value="records.names"
              :rules="rulesValidation.justText.rules"
              :loading="loading"
              @update:model-value="(value) => emitRecords(value, 'names')"
              variant="outlined"
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="4">
            <v-text-field
              :maxlength="rulesValidation.justText.maxLength"
              label="Apellidos"
              :model-value="records.surnames"
              :rules="rulesValidation.justText.rules"
              :loading="loading"
              @update:model-value="(value) => emitRecords(value, 'surnames')"
              variant="outlined"
            ></v-text-field>
          </v-col>
        </template>
        <!-- Business Name or normal name -->
        <v-col cols="12" sm="4" v-else>
          <v-text-field
            :maxlength="rulesValidation.text.maxLength"
            label="Nombre de empresa"
            :model-value="records.business"
            :rules="rulesValidation.text.rules"
            :loading="loading"
            @update:model-value="(value) => emitRecords(value, 'business')"
            variant="outlined"
          ></v-text-field>
        </v-col>
        <v-col cols="12" sm="4">
          <v-text-field
            :maxlength="rulesValidation.text.maxLength"
            label="Dirección"
            :model-value="records.address"
            :rules="rulesValidation.text.rules"
            :loading="loading"
            @update:model-value="(value) => emitRecords(value, 'address')"
            variant="outlined"
          ></v-text-field>
        </v-col>
        <v-col cols="12" sm="4">
          <v-text-field
            :maxlength="rulesValidation.mobile.maxLength"
            label="Teléfono"
            :model-value="records.mobile"
            :rules="rulesValidation.mobile.rules"
            :loading="loading"
            @update:model-value="(value) => emitRecords(value, 'mobile')"
            variant="outlined"
          ></v-text-field>
        </v-col>
        <v-col
          cols="12"
          :sm="
            this.thirdPerson ||
            (records.typeDocument && records.typeDocument != 'NIT')
              ? '6'
              : '4'
          "
        >
          <v-text-field
            :maxlength="rulesValidation.email.maxLength"
            label="Correo Principal"
            :model-value="records.email"
            placeholder="ejemplo@ejemplo.com"
            :rules="rulesValidation.email.rules"
            :loading="loading"
            @update:model-value="(value) => emitRecords(value, 'email')"
            variant="outlined"
          ></v-text-field>
        </v-col>
        <v-col
          cols="12"
          :sm="
            (records.typeDocument && records.typeDocument != 'NIT') ||
            this.thirdPerson
              ? '6'
              : '4'
          "
        >
          <v-text-field
            :maxlength="rulesValidation.email.maxLength"
            label="Correo Secundario (opcional)"
            :model-value="records.email2"
            placeholder="ejemplo@ejemplo.com"
            :rules="verificationSecondEmail"
            :loading="loading"
            @update:model-value="(value) => emitRecords(value, 'email2')"
            variant="outlined"
          ></v-text-field>
        </v-col>
        <v-col
          cols="12"
          :sm="
            (records.typeDocument && records.typeDocument != 'NIT') ||
            this.thirdPerson
              ? 6
              : 4
          "
        >
          <v-text-field
            :maxlength="rulesValidation.optionalPrice.maxLength"
            label="Código Postal"
            @update:model-value="(value) => emitRecords(value, 'postal_code')"
            :model-value="records.postal_code"
            :rules="rulesValidation.optionalPrice.rules"
            :loading="loading"
            variant="outlined"
          ></v-text-field>
        </v-col>
        <v-col
          cols="12"
          :sm="
            (records.typeDocument && records.typeDocument != 'NIT') ||
            this.thirdPerson
              ? 6
              : 4
          "
        >
          <dynamic-select-field
            :options="cities"
            :itemSaved="records.city"
            @update:options="setCities"
            @update:itemSelected="(item) => emitRecords(item, 'city')"
            mainLabel="name"
            title="Ciudad"
            :rules="rulesValidation.select.rules"
            :maxSearchRate="10"
          >
          </dynamic-select-field>
        </v-col>
        <v-col v-if="!thirdPerson" cols="12">
          <strong class="text-caption d-block mb-2"
            >*
            <span class="text-overline">Campo dinamico. </span>
            Escribe entre 3 a 5 letras para completar la busqueda...</strong
          >
          <dynamic-select-field
            :options="ciiuCodes"
            :itemSaved="records.ciiu"
            @update:options="setCiiuCodes"
            @update:itemSelected="(item) => emitRecords(item, 'ciiu')"
            mainLabel="description"
            title="Codigo principal CIIU"
            subtitle="codigo:"
            :secondLabel="['code']"
            :customFilter="filterCiiuItems"
            :customFilterAble="true"
          >
            >
          </dynamic-select-field>
        </v-col>
      </v-row>
      <ciiu-secondary-field
        v-if="!thirdPerson && records.secondaryCiius"
        :records="records.secondaryCiius"
        @update:records="(value) => emitRecords(value, 'secondaryCiius')"
      ></ciiu-secondary-field>
    </v-card-text>
  </v-card>
</template>
<script>
import { castNit } from "@/utils/cast";
import Petition from "@/services/PetitionStructure/Petition.js";
import { RulesValidation } from "@/utils/validations";
import CiiuSecondaryField from "@/components/blocks/CiiuSecondaryField.vue";
import DynamicSelectField from "@/components/blocks/DynamicSelectField.vue";
const petition = new Petition();
export default {
  name: "ThirdFieldCard",
  props: {
    records: Object,
    citiesParent: Object,
    thirdPerson: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    CiiuSecondaryField,
    DynamicSelectField,
  },
  data: () => ({
    editItem: {},

    ciiuCodes: [],
    typesDocument: [],
    cities: [],
    loading: false,

    rulesValidation: RulesValidation,
    dynamicIdRule: [],
  }),

  methods: {
    changeTypeDoc(item) {
      const tempDR = this.rulesValidation.identification.rules;
      if (item == "PASAPORTE") {
        this.dynamicIdRule = tempDR;
      } else {
        this.dynamicIdRule = [
          ...tempDR,
          (value) => /^[0-9]+$/.test(value) || "Formato de campo no valido.",
        ];
      }
      this.emitRecords(item, "typeDocument");
    },
    filterCiiuItems(queryText, item) {
      const searchText = queryText.toLowerCase();
      const textOne = item.raw["description"].toLowerCase();
      let keyTwo = item.raw.code.toString().toLowerCase();
      return (
        textOne.indexOf(searchText) > -1 || keyTwo.indexOf(searchText) > -1
      );
    },
    emitRecords(item, key) {

      this.$emit("update:records", { item: item, key: key });
    },
    async setEditItem() {
      this.editItem = this.records;
      if (!this.editItem.secondaryCiius) this.editItem.secondaryCiius = [];
    },
    async setCities(name = null) {
      const query = name ? `name=${name}` : "";
      this.cities = (await petition.get("/cities", query)).data;
    },
    async setCiiuCodes(code = null) {
      const query = code ? `code=${code}` : "";
      this.ciiuCodes = (await petition.get("/ciiu-codes", query)).data;
    },
    async setTypesDocument() {
      const query = this.thirdPerson ? "type=person" : "";
      this.typesDocument = (
        await petition.get("/type-document-user", query)
      ).data;
    },
  },
  computed: {
    verificationNitNumber() {
      return this.records.typeDocument &&
        this.records.typeDocument == "NIT" &&
        this.records.identification &&
        this.records.identification.length > 0
        ? " - " + castNit(this.records.identification)
        : "";
    },
    verificationSecondEmail() {
      return [
        (value) =>
          !value ||
          /\S+@\S+\.\S+/.test(value) ||
          "Formato de correo electrónico inválido",
        (value) =>
          value !== this.records.email ||
          "El segundo email debe ser diferente. ",
      ];
    },
  },
  async mounted() {
    this.loading = true;
    try {
      await Promise.all([
        this.setCities(),
        this.setTypesDocument(),
        this.setCiiuCodes(),
      ]);
      await this.setEditItem();
    } catch (error) {
      console.error("Alguna de las funciones falló:", error);
    }
    this.loading = false;
  },
};
</script>
