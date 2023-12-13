<!-- eslint-disable vue/no-mutating-props -->
<template>
  <v-form ref="formRef">
    <v-row justify="center">
      <v-dialog v-model="userStore.toggleModal" persistent width="512">
        <v-card>
          <v-card-title>
            <span class="text-h5">{{ userStore.title }}</span>
          </v-card-title>
          <v-card-text >

            <v-card>
              <v-card-text>
                <v-row>
                  <v-col cols="12" sm="6">
                    <v-select
                      :items="typeDocuments"
                      label="Tipo de documento"
                      v-model="userStore.userEdited.typeDocument"
                      item-title="label"
                      item-value="name"
                      :rules="rulesValidation.selectRules"
                    ></v-select>
                  </v-col>
                  <v-col cols="12" sm="6">
                    <v-text-field
                      label="Documento"
                      v-model="userStore.userEdited.identification"
                      :rules="rulesValidation.identification"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6">
                    <v-text-field
                      label="Nombres"
                      v-model="userStore.userEdited.names"
                      :rules="rulesValidation.textRules"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6">
                    <v-text-field
                      label="Apellidos"
                      v-model="userStore.userEdited.surnames"
                      :rules="rulesValidation.textRules"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6">
                    <v-text-field
                      label="Email"
                      v-model="userStore.userEdited.email"
                      :rules="rulesValidation.emailRules"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6">
                    <v-text-field
                      label="Telefono"
                      v-model="userStore.userEdited.mobile"
                      :rules="rulesValidation.mobileRule"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6">
                    <v-autocomplete
                      label="Ciudad"
                      v-model="userStore.userEdited.city"
                      :items="cities"
                      :loading="loading"
                      v-model:search="searchCity"
                      item-title="name"
                      :rules="rulesValidation.selectRules"
                      :return-object="true"
                    ></v-autocomplete>
                  </v-col>
                  <v-col cols="12" sm="6">
                    <v-select
                      :items="offices"
                      label="Oficina"
                      v-model="userStore.userEdited.offices"
                      item-title="name"
                      :return-object="true"
                      multiple
                      :rules="rulesValidation.selectRules"
                    ></v-select>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
            <v-card title="Usuario" variant="outlined" padding="2">
              <v-card-text>
                <v-row>
                  <v-col cols="12" sm="12">
                    <v-text-field
                      label="Nombre de usuario"
                      v-model="userStore.userEdited.name"
                      :rules="rulesValidation.textRules"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6">
                    <v-select
                      label="Estado"
                      :items="status"
                      v-model="userStore.userEdited.status"
                      :rules="rulesValidation.selectRules"
                      item-title="label"
                      item-value="name"
                    ></v-select>
                  </v-col>
                  <v-col cols="12" sm="6">
                    <v-select
                      :items="roles"
                      label="Role"
                      v-model="userStore.userEdited.role"
                      item-title="name"
                      :rules="rulesValidation.selectRules"
                      :return-object="true"
                    ></v-select>
                  </v-col>
                  <v-col cols="12" sm="6">
                    <v-text-field
                      label="Contraseña"
                      type="password"
                      v-model="userStore.userEdited.password"
                      :rules="passwordRule"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6">
                    <v-text-field
                      label="Confirmar contraseña"
                      type="password"
                      :rules="confirmPasswordRule"
                      v-model="userStore.userEdited.confirmPassword"

                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
            <div class="pt-5">
            <small v-for="(error, index) in errorMessages" :key="index" class="text-orange">
                {{(index+1) +'. '+ error }} <br>
            </small>
          </div>
          </v-card-text>
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
            <v-btn color="blue-darken-1" variant="text" @click="submitForm" :loading="userStore.loader">
              Save
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
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
  updateUser,
} from "@/services/userService";
import { getShortOffices } from "@/services/officeService";
import { useUserStore } from "@/store/users";
import { computed, onMounted, ref, watch } from "vue";

const loading = ref(false);
const userStore = useUserStore();
const cities = ref([]);
const roles = ref([]);
const typeDocuments = ref([]);
const offices = ref([]);
const searchCity = ref("");
const citySaved = ref({});
const formRef = ref(null);
const errorMessages = ref([])
const status = [
  { name: "A", label: "Activo" },
  { name: "I", label: "Inactivo" },
];
const rulesValidation = {
  textRules: [
    (value) => !!value || "Nombre es requirido",
    (value) =>
      (value && value.length >= 3) || "Nombre debe ser de almenos 3 caracteres",
  ],
  identification: [
    (value) => !!value || "Identificación es requerida",
    (value) =>
      (value && value.length >= 7 && value.length <= 10) ||
      "Identificación tiene que ser entre 7 y 10 caracteres",
  ],
  emailRules: [
    (value) => !!value || "Email es requirido",
    (value) =>
      /\S+@\S+\.\S+/.test(value) || "Formato de correo electrónico inválido",
  ],
  mobileRule: [
    (value) => !!value || "El teléfono es requirido",
    (value) =>
      /^[0-9]{10,13}$/.test(value) ||
      "Formato de teléfono inválido (10 dígitos)",
  ],
  selectRules: [(value) => !!value || "Debes seleccionar una opción"],
  passwordRule: [
    (value) => !!value || "Contraseña es requerida",
    (value) =>
      (value && value.length >= 6) ||
      "Contraseña debe tener al menos 6 caracteres",
  ],
};
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
          value === userStore.userEdited.password || "Las contraseñas no coinciden",
      ]
    : [
        (value) =>
          value === userStore.userEdited.password || "Las contraseñas no coinciden",
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

async function submitForm() {
  console.log("before", userStore.userEdited);
  console.log("before", citySaved.value);
  const valid = true;
  // const { valid } = await formRef.value.validate();
  if (valid) {
    userStore.setLoader();
    //passing validations 🚥
    const formData = new FormData();
    let response = false;
    if (userStore.kindModal == "delete") {
      formData.append("users_id", userStore.usersSelected);
      response = await deleteUsers(formData);
    } else {
      formData.append("type_document", userStore.userEdited.typeDocument);
      formData.append("identification", userStore.userEdited.identification);
      formData.append("names", userStore.userEdited.names);
      formData.append("surnames", userStore.userEdited.surnames);
      formData.append("address", userStore.userEdited.address);
      formData.append("mobile", userStore.userEdited.mobile);
      formData.append("email", userStore.userEdited.email);
      formData.append("city_id", userStore.userEdited.city.id);
      formData.append("status", userStore.userEdited.status);
      formData.append("role_id", userStore.userEdited.role.id);
      formData.append(
        "offices_id[]",
        userStore.userEdited.offices.map((item) => +item.id)
      );
      formData.append("name", userStore.userEdited.name);
      for (const entry of formData) {
  console.log(entry);
}
      if (userStore.kindModal == "update") {
        console.log('update',userStore.userEdited);
        formData.append("user_id", userStore.userEdited.userId);
        if (userStore.userEdited.password)
          formData.append("password", userStore.userEdited.password);
          for (const entry of formData) {
  console.log(entry);
}
        response = await updateUser(formData);
      } else {
        formData.append("password", userStore.userEdited.password);
        response = await createUser(formData);
      }
    }
    console.log('response',response)
    if (response.error) {
      userStore.showAlert(false);
      showErrorMessages(response);
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
function showErrorMessages(response){
  console.log('error entroando',response)
    errorMessages.value = Object.values(response.error).flat();

}
onMounted(async () => {
  typeDocuments.value = await getTypeDocument();
  roles.value = await getRoles();
  const data = await getShortOffices();
  console.log('offices',data)
  offices.value =data;

});
</script>
