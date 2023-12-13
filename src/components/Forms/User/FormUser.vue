<template>
<v-form ref="formRef">
  {{idEditForm}}
    <v-row justify="center">
      <v-card rounded="3" class="w-100">
        <v-card-title>
          <span class="text-h5">{{ titleForm }} </span>
        </v-card-title>

        <!----------------------- FORM --------------------------->
        <v-card-text>
          <v-row>
            <v-col cols="12" lg="6">
              <v-card rounded="true" elevation="0">
                <v-card-text>
                  <v-row>
                    <v-col cols="12" sm="6">
                      <v-select
                        label="Tipo de documento"
                        v-model="editUser.typeDocument"
                        item-title="label"
                        item-value="name"
                      ></v-select>
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-text-field
                        label="Documento"
                        v-model="editUser.identification"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-text-field
                        label="Nombres"
                        v-model="editUser.names"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-text-field
                        label="Apellidos"
                        v-model="editUser.surnames"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-text-field
                        label="Email"
                        v-model="editUser.email"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-text-field
                        label="Telefono"
                        v-model="editUser.mobile"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-autocomplete
                        label="Ciudad"
                        v-model="editUser.city"
                        :items="cities"
                        v-model:search="searchCity"
                        item-title="name"
                        :return-object="true"
                      ></v-autocomplete>
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-select
                        :items="offices"
                        label="Oficina"
                        v-model="editUser.offices"
                        item-title="name"
                        :return-object="true"
                        multiple
                      ></v-select>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-col>
            <v-col cols="12" lg="6">
              <v-card title="Usuario" variant="outlined" padding="2">
                <v-card-text>
                  <v-row>
                    <v-col cols="12" sm="12">
                      <v-text-field
                        label="Nombre de usuario"
                        v-model="editUser.name"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-select
                        label="Estado"
                        :items="status"
                        v-model="editUser.status"
                        item-title="label"
                        item-value="name"
                      ></v-select>
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-select
                        :items="roles"
                        label="Role"
                        v-model="editUser.role"
                        item-title="name"
                        :return-object="true"
                      ></v-select>
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-text-field
                        label="Contraseña"
                        type="password"
                        v-model="editUser.password"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-text-field
                        label="Confirmar contraseña"
                        type="password"
                        v-model="editUser.confirmPassword"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-card-text>
        <!----------------------- FORM --------------------------->

        <!-- <div class="pt-5">
          <small
            v-for="(error, index) in errorMessages"
            :key="index"
            class="text-orange"
          >
            {{ index + 1 + ". " + error }} <br />
          </small>
        </div>

        <v-card-text v-if="userStore.kindModal == 'delete'">
          Estas seguro que deseas eliminar
          {{
            userStore.usersSelected.length == 1
              ? userStore.usersSelected.length + " usuario"
              : userStore.usersSelected.length + " usuarios"
          }}?
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="blue-darken-1"
            variant="text"
            @click="userStore.hiddenModal"
            :loading="userStore.loader"
          >
            Close
          </v-btn>
          <v-btn
            color="blue-darken-1"
            variant="text"
            @click="submitForm"
            :loading="userStore.loader"
          >
            Save
          </v-btn>
        </v-card-actions> -->
      </v-card>
    </v-row>
  </v-form>
</template>

<script>
import UserApi from '@/services/Forms/UserApi.js';

const userApi = new UserApi();

export default  {
    name: 'FormUser',
    props: ['idEditForm'],
    data: () => ({
        titleForm: 'Usuario',
        loading: false,
        cities: [],
        roles: [],
        typeDocuments: [],
        offices: [],
        searchCity: "",
        formRef: null,
        errorMessages: [],
        editUser: {},
        status: [
            { name: "A", label: "Activo" },
            { name: "I", label: "Inactivo" },
        ],
    }),
    mounted(){
      this.getDataEditForm();
    },
    components:{
    },
    methods:{
      async getDataEditForm(){
        if(!this.idEditForm) return;
        const data = await userApi.read(`?user_id=${this.idEditForm}`)
      }
    }
}
</script>