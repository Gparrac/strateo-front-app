<template>
  <v-form ref="form">
    <v-row justify="center">
      <v-card rounded="3" class="w-100">
        <v-card-title>
          <span class="text-h5">{{ title }} </span>
        </v-card-title>

        <!----------------------- FORM --------------------------->
        <v-card-text>
          <v-row>
            <v-col cols="12">
              <v-text-field
                label="Nombre"
                v-model="editItem.name"
                :rules="rulesValidation.text.rules"
                :loading="loading"
                :disabled="custom"
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-textarea
                label="Descripción"
                v-model="editItem.description"
                :rules="rulesValidation.text.rules"
                :loading="loading"
                :disabled="custom"
              ></v-textarea>
            </v-col>
          </v-row>
          <v-table>
            <thead>
              <tr class="text-left">
                <th>SECCIONES</th>
                <th>FORMULARIOS</th>
                <th
                  v-for="item in permissions"
                  :key="item.id"
                  class="text-center"
                >
                  {{ item.name }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, findex) in forms" :key="'r' + item.id">
                <td>{{ item.section_name }}</td>
                <td>{{ item.name }}</td>
                <td
                  v-for="pitem in permissions"
                  :key="pitem.id"
                  class="text-center"
                >
                  <v-checkbox
                    color="primary"
                    v-model="editItem.forms[findex].permissions_id"
                    class="d-flex justify-center"
                    @update:modelValue="validatePermissions(findex)"
                    :value="pitem.id"
                  ></v-checkbox>
                </td>
                <td class="text-center">
                  <v-checkbox
                    color="orange"
                    class="d-flex justify-center"
                    @change="selectAllPermission(item.selectAll, findex)"
                    v-model="item.selectAll"
                  ></v-checkbox>
                </td>
              </tr>
            </tbody>
          </v-table>
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
import RoleApi from "@/services/Forms/RoleApi.js";
import FormApi from "@/services/Forms/FormApi.js";
import Petition from "@/services/PetitionStructure/Petition.js";
import { RulesValidation } from "@/utils/validations";
import { mapStores } from "pinia";
import { useAlertMessageStore } from "@/store/alertMessage";

const roleApi = new RoleApi();
const formApi = new FormApi();
const petition = new Petition();

export default {
  name: "FormUser",
  props: {
    idEditForm: Number,
    nameTable: String,
    path: String,
  },
  components: {},
  data: () => ({
    loading: false,
    forms: [],
    permissions: [],
    errorMessages: [],
    editItem: {},
    rulesValidation: RulesValidation,
  }),
  async mounted() {
    this.loading = true;
    try {
      await Promise.all([
        await this.setEditItem(),
        await this.setPermissions(),
        await this.setForms(),
      ]);
      this.createSelectsAll();
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
    async submitForm() {
      this.loading = true;
      const { valid } = await this.$refs.form.validate();
      if (valid) {
        //passing validations 🚥
        const formData = new FormData();
        let response = {};

        formData.append("name", this.editItem.name);
        formData.append("description", this.editItem.description);
        this.editItem.forms.forEach((form, index) => {
          // Agregar form_id
          formData.append(`forms[${index}][form_id]`, form.form_id);
          // Iterar sobre el array de permissions_id y agregar cada permission_id como entrada en FormData

          form.permissions_id.forEach((permissionId, permissionIndex) => {
            formData.append(
              `forms[${index}][permissions_id][${permissionIndex}]`,
              permissionId || []
            );
          });
        });

        if (this.idEditForm) {
          formData.append("role_id", this.editItem.id);
          response = await roleApi.update(formData);
        } else {
          formData.append("password", this.editItem.password);
          response = await roleApi.create(formData);
        }
        if (response.error) {
          this.alertMessageStore.show(false, "Error en el servidor");
          // lack to define logic to pass show errors in FormUser 🚨
        } else {
          this.alertMessageStore.show(true, "Poceso exitoso!");
          this.$router.push(`/${this.path}`);
          // lack to define logic to pass show alert in TableUser 🚨
        }
      }
      this.loading = false;
    },
    createSelectsAll() {
      if (!this.idEditForm) {
        this.editItem.forms = Array(this.forms.length).fill({
          permissions_id: [],
        });
        this.editItem.forms = this.forms.map((item) => {
          item.selectAll = false;
          return { form_id: item.id, permissions_id: [] };
        });
      } else {
        this.forms.forEach((item, i) => {
          item.selectAll =
            this.editItem.forms[i].permissions_id.length ==
            this.permissions.length
              ? true
              : false;
        });
      }
    },
    async setForms() {
      this.forms = (await formApi.read()).data;
    },
    async setPermissions() {
      this.permissions = (await petition.get("/permissions")).data;
    },
    async setEditItem() {
      if (!this.idEditForm) return;
      this.editItem = (await roleApi.read(`?role_id=${this.idEditForm}`)).data;
    },
    validatePermissions(formIndex) {
      this.forms[formIndex].selectAll =
        this.editItem.forms[formIndex].permissions_id.length ==
        this.permissions.length
          ? true
          : false;
      if (
        this.editItem.forms[formIndex].permissions_id.indexOf(1) == -1 &&
        this.editItem.forms[formIndex].permissions_id.length > 0
      ) {
        this.editItem.forms[formIndex].permissions_id = [
          1,
          ...this.editItem.forms[formIndex].permissions_id,
        ];
      }
    },
    selectAllPermission(item, formIndex) {
      if (!item) {
        this.editItem.forms[formIndex].permissions_id = [];
      } else {
        this.editItem.forms[formIndex].permissions_id = this.permissions.map(
          (item) => item.id
        );
      }
    },
  },
};
</script>
