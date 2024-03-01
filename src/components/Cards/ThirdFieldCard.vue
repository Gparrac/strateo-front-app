<template>
    <v-card rounded="true" elevation="0" title="Datos personales">
        <v-card-text>
            <!-- Business Name or normal name -->
            <v-row>
                <v-col cols="12" sm="4">
                    <v-select label="Tipo de documento" v-model="editItem.typeDocument" item-title="label" item-value="name"
                        :items="typesDocument" :rules="rulesValidation.select.rules" :loading="loading"
                        @update:model-value="emitRecords"></v-select>
                </v-col>
                <v-col cols="12" sm="4">
                    <v-text-field :maxlength="rulesValidation.identification.maxLength" label="Número de documento"
                        v-model="editItem.identification" :rules="rulesValidation.identification.rules" :loading="loading"
                         :suffix="verificationNitNumber" @update:model-value="emitRecords"></v-text-field>
                </v-col>
                <template v-if="editItem.typeDocument && editItem.typeDocument != 'NIT'
                    ">
                    <v-col cols="12" sm="4">
                        <v-text-field :maxlength="rulesValidation.text.maxLength" label="Nombres" v-model="editItem.names"
                            :rules="rulesValidation.text.rules" :loading="loading"
                            @update:model-value="emitRecords"></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="4">
                        <v-text-field :maxlength="rulesValidation.text.maxLength" label="Apellidos"
                            v-model="editItem.surnames" :rules="rulesValidation.text.rules" :loading="loading"
                            @update:model-value="emitRecords"></v-text-field>
                    </v-col>
                </template>
                <!-- Business Name or normal name -->
                <v-col cols="12" sm="4" v-else>
                    <v-text-field :maxlength="rulesValidation.text.maxLength" label="Nombre de empresa"
                        v-model="editItem.business" :rules="rulesValidation.text.rules" :loading="loading"
                        @update:model-value="emitRecords"></v-text-field>
                </v-col>
                <v-col cols="12" sm="4">
                    <v-text-field :maxlength="rulesValidation.text.maxLength" label="Dirección" v-model="editItem.address"
                        :rules="rulesValidation.text.rules" :loading="loading"
                        @update:model-value="emitRecords"></v-text-field>
                </v-col>
                <v-col cols="12" sm="4">
                    <v-text-field :maxlength="rulesValidation.mobile.maxLength" label="Teléfono" v-model="editItem.mobile"
                        :rules="rulesValidation.mobile.rules" :loading="loading"
                        @update:model-value="emitRecords"></v-text-field>
                </v-col>
                <v-col cols="12" :sm="editItem.typeDocument && editItem.typeDocument != 'NIT'
                        ? '6'
                        : '4'
                    ">
                    <v-text-field :maxlength="rulesValidation.email.maxLength" label="Correo Principal"
                        v-model="editItem.email" placeholder="ejemplo@ejemplo.com" :rules="rulesValidation.email.rules"
                        :loading="loading" @update:model-value="emitRecords"></v-text-field>
                </v-col>
                <v-col cols="12" :sm="editItem.typeDocument && editItem.typeDocument != 'NIT'
                        ? '6'
                        : '4'
                    ">
                    <v-text-field :maxlength="rulesValidation.email.maxLength" label="Correo Secundario (opcional)"
                        v-model="editItem.email2" placeholder="ejemplo@ejemplo.com" :rules="verificationSecondEmail"
                        :loading="loading" @update:model-value="emitRecords"></v-text-field>
                </v-col>
                <v-col cols="12" :sm="editItem.typeDocument && editItem.typeDocument != 'NIT'
                        ? 6
                        : 4
                    ">
                    <v-text-field :maxlength="rulesValidation.text.maxLength" label="Código Postal"
                        v-model="editItem.postal_code" :rules="rulesValidation.text.rules" :loading="loading"
                        @update:model-value="emitRecords"></v-text-field>
                </v-col>
                <v-col cols="12" :sm="editItem.typeDocument && editItem.typeDocument != 'NIT'
                        ? 6
                        : 4
                    ">
                    <v-autocomplete label="Ciudad" v-model="editItem.city_id" :items="cities" v-model:search="searchCity"
                        item-title="name" item-value="id" :rules="rulesValidation.select.rules" :loading="loading"
                        @update:model-value="emitRecords"></v-autocomplete>
                </v-col>
                <v-col v-if="!thirdPerson" cols="12">
                    <strong class="text-caption d-block mb-2">*
                        <span class="text-overline">Campo dinamico. </span>
                        Escribe entre 3 a 5 letras para completar la
                        busqueda...</strong>
                    <v-autocomplete  label="Codigo principal CIIU" v-model="editItem.ciiu" :items="ciiuCodes"
                        v-model:search="searchCiiu" item-title="description" :return-object="true"
                        :rules="rulesValidation.select.rules" :loading="loading"
                        @update:model-value="emitRecords"></v-autocomplete>
                </v-col>
            </v-row>
            <ciiu-secondary-field v-if="!thirdPerson && editItem.secondaryCiius" :records="editItem.secondaryCiius"
                @update:records="(item) => (changeSecondaryCiius(item))"></ciiu-secondary-field>
        </v-card-text>
    </v-card>
</template>
<script>
import { castNit } from "@/utils/cast";
import Petition from "@/services/PetitionStructure/Petition.js";
import { RulesValidation } from "@/utils/validations";
import CiiuSecondaryField from "@/components/blocks/CiiuSecondaryField.vue";
const petition = new Petition();
export default {
    name: 'ThirdFieldCard',
    props: {
        records: Object,
        citiesParent: Object,
        thirdPerson: {
          type: Boolean,
          default: false
        }
    },
    components: {
        CiiuSecondaryField
    },
    data: () => ({
        editItem: {},
        searchCity: "",
        ciiuCodes: [],
        typesDocument: [],
        cities: [],
        loading: false,
        searchCiiu: "",
        rulesValidation: RulesValidation,
    }),


    methods: {
        changeSecondaryCiius(item) {
            this.editItem.secondaryCiius = item;
            this.emitRecords();
        },
        emitRecords() {
            this.$emit('update:records', this.editItem);
        },
        async setEditItem() {

            this.editItem = this.records;
            if (!this.editItem.secondaryCiius) this.editItem.secondaryCiius = []
        },
        async setCities(name = null) {
            const query = name ? `name=${name}` : "";
            this.cities = this.citiesParent && !name ?
            this.citiesParent :
            (await petition.get("/cities", query)).data;
        },
        async setCiiuCodes(name = null) {
          if(this.thirdPerson){
            const query = name ? `name=${name}` : "";
            this.ciiuCodes = (await petition.get("/ciiu-codes", query)).data;
          }
        },
        async setTypesDocument() {
          const query = this.thirdPerson ? 'type=person' : '';
            this.typesDocument = (await petition.get("/type-document-user", query)).data;
        },
    },
    computed: {
        verificationNitNumber() {
            return this.editItem.typeDocument &&
                this.editItem.typeDocument == "NIT" &&
                this.editItem.identification &&
                this.editItem.identification.length > 0
                ? " - " + castNit(this.editItem.identification)
                : "";
        },
        verificationSecondEmail() {
            return [
                (value) =>
                    !value ||
                    /\S+@\S+\.\S+/.test(value) ||
                    "Formato de correo electrónico inválido",
                (value) =>
                    value !== this.editItem.email ||
                    "El segundo email debe ser diferente. ",
            ];
        },

    },
    watch: {
        async searchCity(to) {
            if (to.length > 3) {
                this.setCities(to);
            }
        },
        async searchCiiu(to) {
            if (to.length > 3 && to.length < 5) {
                this.setCiiuCodes(to);
            }
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
}

</script>
