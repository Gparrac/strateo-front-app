<!-- eslint-disable vue/no-mutating-props -->
<template>
  <v-form ref="formRef" class="pa-15">
    <v-row justify="center">
      <v-card rounded="3">
        <v-card-title>
          <span class="text-h5">{{ userStore.title }} </span>
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12" lg="6">
              <v-card rounded="true" elevation="0">
                <v-card-text>
                  <v-row>
                    <v-col cols="12" sm="6">
                      <v-select
                        :items="typeDocuments"
                        label="Tipo de documento"
                        v-model="editUser.typeDocument"
                        item-title="label"
                        item-value="name"
                        :rules="rulesValidation.select"
                      ></v-select>
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-text-field
                        label="Documento"
                        v-model="editUser.identification"
                        :rules="rulesValidation.identification"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-text-field
                        label="Nombres"
                        v-model="editUser.names"
                        :rules="rulesValidation.text"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-text-field
                        label="Apellidos"
                        v-model="editUser.surnames"
                        :rules="rulesValidation.text"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-text-field
                        label="Email"
                        v-model="editUser.email"
                        :rules="rulesValidation.email"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-text-field
                        label="Telefono"
                        v-model="editUser.mobile"
                        :rules="rulesValidation.mobile"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-autocomplete
                        label="Ciudad"
                        v-model="editUser.city"
                        :items="cities"
                        :loading="loading"
                        v-model:search="searchCity"
                        item-title="name"
                        :rules="rulesValidation.select"
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
                        :rules="rulesValidation.select"
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
                        :rules="rulesValidation.textRules"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-select
                        label="Estado"
                        :items="status"
                        v-model="editUser.status"
                        :rules="rulesValidation.selectRules"
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
                        :rules="rulesValidation.selectRules"
                        :return-object="true"
                      ></v-select>
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-text-field
                        label="Contraseña"
                        type="password"
                        v-model="editUser.password"
                        :rules="passwordRule"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-text-field
                        label="Confirmar contraseña"
                        type="password"
                        :rules="confirmPasswordRule"
                        v-model="editUser.confirmPassword"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-card-text>
        <div class="pt-5">
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
        </v-card-actions>
      </v-card>
    </v-row>
  </v-form>
</template>
<script setup>
import { getCities } from "@/services/cityService";
import { getRoles } from "@/services/roleService";
import {
  createUser,
  deleteUsers,
  getTypeDocument,
  getUser,
  updateUser,
} from "@/services/userService";
import { getShortOffices } from "@/services/officeService";
import { useUserStore } from "@/store/users";
import { computed, onMounted, ref, watch } from "vue";
import { rulesValidation } from "@/utils/validations";
import { useRoute } from "vue-router";
const router = useRoute();
const loading = ref(false);
const userStore = useUserStore();
const cities = ref([]);
const roles = ref([]);
const typeDocuments = ref([]);
const offices = ref([]);
const searchCity = ref("");
const formRef = ref(null);
const errorMessages = ref([]);
const editUser = ref({});
const status = [
  { name: "A", label: "Activo" },
  { name: "I", label: "Inactivo" },
];

const passwordRule = computed(() =>
  userStore.kindModal == "create"
    ? [
        (value) => !!value || "Contraseña es requerida",
        (value) =>
          (value && value.length >= 6) ||
          "Contraseña debe tener al menos 6 caracteres",
      ]
    : []
);
const confirmPasswordRule = computed(() =>
  userStore.kindModal == "create"
    ? [
        (value) => !!value || "Contraseña es requerida",
        (value) =>
          value === editUser.value.password || "Las contraseñas no coinciden",
      ]
    : [
        (value) =>
          value === editUser.value.password || "Las contraseñas no coinciden",
      ]
);

watch(searchCity, async (newVal) => {
  if (newVal.length > 3) {
    const response = await getCities(newVal);
    cities.value = [];
    console.log("tem", response);
    cities.value = response;
  }
});

async function getUserInfo() {
  console.log("rta", router.params.userId);
  if (router.params.userId) {
    const response = await getUser(router.params.userId);
    console.log("rta", response);
    editUser.value = Object.assign(
      {},
      {
        userId: response.id,
        name: response.name,
        typeDocument: response.third.type_document,
        identification: response.third.identification,
        names: response.third.names,
        surnames: response.third.surnames,
        address: response.third.address,
        mobile: response.third.mobile,
        email: response.third.email,
        city: response.third.city,
        status: response.status,
        role: response.role,
        offices: response.offices.map((item) => ({
          id: item.id,
          name: item.name,
        })),
      }
    );
  }
}
async function submitForm() {
  const { valid } = await formRef.value.validate();
  if (valid) {
    userStore.setLoader();
    //passing validations 🚥
    const formData = new FormData();
    let response = false;
    formData.append("type_document", editUser.value.typeDocument);
    formData.append("identification", editUser.value.identification);
    formData.append("names", editUser.value.names);
    formData.append("surnames", editUser.value.surnames);
    formData.append("address", editUser.value.address);
    formData.append("mobile", editUser.value.mobile);
    formData.append("email", editUser.value.email);
    formData.append("city_id", editUser.value.city.id);
    formData.append("status", editUser.value.status);
    formData.append("role_id", editUser.value.role.id);
    formData.append(
      "offices_id[]",
      userStore.userEdited.offices.map((item) => +item.id)
    );
    formData.append("name", userStore.userEdited.name);

    if (userStore.kindModal == "update") {
      console.log("update", userStore.userEdited);
      formData.append("user_id", userStore.userEdited.userId);
      if (userStore.userEdited.password)
        formData.append("password", userStore.userEdited.password);

      response = await updateUser(formData);
    } else {
      formData.append("password", userStore.userEdited.password);
      response = await createUser(formData);
    }

    console.log("response", response);
    if (response.error) {
      userStore.showAlert(false);
    } else {
      console.log("consesión exitosa!");
      await userStore.fetchRecords();
      userStore.showAlert(true);
      userStore.hiddenModal();
    }
  } else {
    userStore.showAlert(true);
  }
  userStore.setLoader();
}
onMounted(async () => {
  await getUserInfo();
  typeDocuments.value = await getTypeDocument();
  roles.value = await getRoles();
  offices.value = await getShortOffices();
});
</script>
