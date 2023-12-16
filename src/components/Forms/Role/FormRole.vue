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
      <v-col cols="12" >
                      <v-text-field
                        label="Nombre"
                        v-model="editItem.name"
                        :rules="rulesValidation.text"
                        :loading="loading"
                        :disabled="custom"

                      ></v-text-field>
                    </v-col>
      <v-col cols="12" >
                      <v-textarea
                        label="Describción"
                        v-model="editItem.description"
                        :rules="rulesValidation.text"
                        :loading="loading"
                        :disabled="custom"
                      ></v-textarea>
                    </v-col>
    </v-row>
          <v-table>
    <thead>
      <tr class="text-left">
        <th>
          Formularios
        </th>
        <th v-for="item in permissions"  :key="item.id" class="text-left">
          {{ item.name }}
        </th>
      </tr>

    </thead>
    <tbody>

      <tr
        v-for="(item, findex) in forms"
        :key="'r'+item.id"
      >
        <td>{{ item.name }}</td>
        <td v-for="pitem in permissions" :key="pitem.id" class="text-left">
          <v-switch
          color="primary"
          v-model="editItem.forms[findex].permissions_id"
          :label="pitem.id"
          :value="pitem.id"
        ></v-switch>
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
            Close
          </v-btn>
          <v-btn
            color="blue-darken-1"
            variant="text"
            @click="submitForm"
            :loading="loading"
          >
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-row>
  </v-form>
</template>

<script>
import RoleApi from "@/services/Forms/RoleApi.js";
import FormApi from "@/services/Forms/RoleApi.js";
import Petition from "@/services/PetitionStructure/Petition.js";
import { RulesValidation } from "@/utils/validations";


const roleApi = new RoleApi();
const formApi = new FormApi();
const petition = new Petition();


export default {
  name: "FormUser",
  props: ["idEditForm"],
  components: {},
  data: () => ({
    loading: false,
    forms: [],
    permissions: [],
    errorMessages: [],
    editItem: {},
    rulesValidation: RulesValidation
  }),
  async mounted() {
    try {
        await Promise.all([
          this.setEditRole(),
          this.setEditItem(),
          this.setPermissions(),
        ]);
      } catch (error) {
        console.error('Alguna de las funciones falló:', error);
      }
      console.log('editItem',this.editItem);
  },
  computed: {
    title(){
      return this.idEditForm ? 'Edición de Usuario' : 'Creación de Usuario';
    }
  },
  methods: {
    submitForm(){
      console.log('submitForm',this.editItem)
      this.$router.push(`/${this.path}`);
    },
    async setEditItem(){
      this.forms = (await formApi.read()).data;
      if (!this.idEditForm){
        this.editItem.forms = this.forms.map((item) =>{
          return {form_id:item.id,permissions_id:[]}
        });
      }
    },
    async setPermissions(){
      this.permissions = (await petition.get('/permissions')).data;
    },
    async setEditRole() {
      if (!this.idEditForm) return;
      this.editItem = (await roleApi.read(`&role_id=${this.idEditForm}`)).data;
      console.log('edit',this.editItem)
    },
  },
};
</script>
