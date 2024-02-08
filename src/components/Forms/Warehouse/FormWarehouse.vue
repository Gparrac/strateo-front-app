<template>
  <v-form ref="form">
    <v-row justify="center">
      <v-card rounded="3" class="w-100" :loading="loading">
        <v-card-title>
          <span class="text-h5">{{ title }} </span>
        </v-card-title>

        <!----------------------- FORM --------------------------->
        <v-card-text>
          <v-row>
            <v-col cols="12">
              <thirdFieldCard
                :key="thirdKeyCard"
                :records="editItem"
                @update:records="
                  (item) => (editItem = { ...editItem, ...item })
                "
                :citiesParent="cities"

              ></thirdFieldCard>
            </v-col>
            <v-col cols="12">
              <v-card rounded="true" elevation="0" title="Datos de la Bodega">
                <v-card-text>
                  <v-row>
                    <v-col cols="12" sm="12">
                      <v-textarea
                        label="Nota"
                        v-model="editItem.note"
                        :maxLength="rulesValidation.longText.maxLength"
                        :rules="rulesValidation.longText.rules"
                        :loading="loading"
                      ></v-textarea>
                    </v-col>
                    <v-col cols="12" sm="4">
                      <v-text-field :maxlength="rulesValidation.text.maxLength" label="Dirección" v-model="editItem.address_warehouse"
                          :rules="rulesValidation.text.rules" :loading="loading"></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="4">
                        <v-autocomplete label="Ciudad" v-model="editItem.city_warehouse_id" :items="cities" v-model:search="searchCity"
                            item-title="name" item-value="id" :rules="rulesValidation.select.rules" :loading="loading"></v-autocomplete>
                    </v-col>
                    <v-col cols="12" sm="4">
                      <v-select
                        label="Estado"
                        :items="status"
                        v-model="editItem.status"
                        item-title="label"
                        item-value="name"
                        :rules="rulesValidation.select.rules"
                        :loading="loading"
                      ></v-select>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-card-text>
        <!----------------------- FORM --------------------------->
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="blue-darken-1"
            variant="text"
            @click="() => $router.push(`/${path}`)"
            :loading="loading"
          >
            Cerrar
          </v-btn>
          <v-btn
            color="blue-darken-1"
            variant="text"
            @click="submitForm"
            :loading="loading"
          >
            Guardar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-row>
  </v-form>
</template>

<script>
import WarehouseApi from "@/services/Forms/WarehouseApi.js";
import { RulesValidation } from "@/utils/validations";
import { mapStores } from "pinia";
import { useAlertMessageStore } from "@/store/alertMessage";
import ThirdFieldCard from "@/components/Cards/ThirdFieldCard.vue";
import Petition from "@/services/PetitionStructure/Petition.js";

const petition = new Petition();
const warehouseApi = new WarehouseApi();

export default {
  name: "FormWarehouse",
  props: {
    idEditForm: Number,
    nameTable: String,
    path: String,
  },
  components: {
    ThirdFieldCard
  },
  data: () => ({
    // required data
    loading: false,
    editItem: {},
    // optional data
    rulesValidation: RulesValidation,
    status: [
      { name: "A", label: "Activo" },
      { name: "I", label: "Inactivo" },
    ],
    thirdKeyCard:0,
    cities: [],
    searchCity: ''
  }),
  async mounted() {
    this.loading = true;
    try {
      await Promise.all([
        this.setEditItem(),
        this.setCities(),
      ]);
    } catch (error) {
      console.error("Alguna de las funciones falló:", error);
    }
    this.loading = false;
  },
  computed: {
    title() {
      return this.idEditForm
        ? `Edición de ${this.nameTable}`
        : `Creación de ${this.nameTable}`;
    },
    ...mapStores(useAlertMessageStore),
  },
  methods: {
    async setCities(name = null) {
      const query = name ? `name=${name}` : "";
      this.cities = (await petition.get("/cities", query)).data;
    },
    async submitForm() {
      this.loading = true;
      const { valid } = await this.$refs.form.validate();
      if (valid) {
        //passing validations 🚥
        const formData = new FormData();
        let response = {};
        // third fields 🚥
        formData.append("type_document", this.editItem.typeDocument);
        formData.append("identification", this.editItem.identification);
        formData.append("verification_id", this.editItem.verification_id);
        formData.append("address", this.editItem.address);
        formData.append("mobile", this.editItem.mobile);
        formData.append("email", this.editItem.email);
        formData.append("code_ciiu_id", this.editItem.ciiu.id);
        if (this.editItem.typeDocument == "NIT") {
          formData.append("business_name", this.editItem.business);
        } else {
          formData.append("names", this.editItem.names);
          formData.append("surnames", this.editItem.surnames);
        }
        if (this.editItem.email2)
          formData.append("email2", this.editItem.email2);
        formData.append("postal_code", this.editItem.postal_code);
        formData.append("city_id", this.editItem.city_id);
        this.editItem.secondaryCiius.forEach((item, cindex) => {
          formData.append(`secondary_ciiu_ids[${cindex}]`, item.id);
        });

        // warehouse field
        formData.append("note", this.editItem.note);
        formData.append("city_warehouse_id", this.editItem.city_warehouse_id);
        formData.append("address_warehouse", this.editItem.address_warehouse);
        formData.append("status", this.editItem.status);
        
        if (this.idEditForm) {
          formData.append("warehouse_id", this.editItem.warehouse_id);
          response = await warehouseApi.update(formData);
        } else {
          response = await warehouseApi.create(formData);
        }
        // logic to show alert 🚨
        if (response.statusResponse != 200) {
          if (response.error && typeof response.error === "object") {
            this.alertMessageStore.show(
              false,
              "Error en la solicitud.",
              response.error
            );
          } else {
            this.alertMessageStore.show(false, "Error en el servidor.");
          }
        } else {
          this.alertMessageStore.show(true, "Proceso exitoso!");
          this.$router.push(`/${this.path}`);
        }
      }
      this.loading = false;
    },
    async setEditItem() {
      if (!this.idEditForm) return;
      const response = await warehouseApi.read(`warehouse_id=${this.idEditForm}`);
      if (response.statusResponse != 200) {
        this.editItem = {};
        return;
      }
      this.editItem = Object.assign(
        {},
        {
          //warehouse attributes
          warehouse_id: response.data.id,
          note: response.data.note,
          address_warehouse: response.data.address,
          city_warehouse_id: response.data.city_id,
          status: response.data.status,

          //third attributes
          typeDocument: response.data.third.type_document,
          identification: response.data.third.identification,
          names: response.data.third.names,
          surnames: response.data.third.surnames,
          business: response.data.third.business_name,
          address: response.data.third.address,
          mobile: response.data.third.mobile,
          email: response.data.third.email,
          postal_code: response.data.third.postal_code,
          city_id: response.data.third.city_id,
          ciiu: response.data.third.ciiu,
          secondaryCiius: response.data.third.secondary_ciius,
          services: response.data.services,
        }
      );

      this.thirdKeyCard = this.thirdKeyCard + 1 ;

    },
  },
  watch: {
    async searchCity(to) {
        if (to.length > 3) {
            this.setCities(to);
        }
    },
  }
};
</script>
