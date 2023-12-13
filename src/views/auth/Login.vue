<script setup>
import { getTypeDocument } from "@/services/userService";
import { signIn } from "@/services/auth/authService";
import { rulesValidation } from "@/utils/validations";
import { onMounted, ref } from "vue";
import router from "@/router";
const typeAuth = ref(false);
const form = ref({});
const formRef = ref({});
const typesDocument = ref([]);
const loader = ref(false);

onMounted(async () => {
  typesDocument.value = await getTypeDocument();
});

async function logIn() {
  loader.value = true;
  const { valid } = await formRef.value.validate();
  if (valid) {
    const formData = new FormData();
    if (typeAuth.value) {
      formData.append("type_document", form.value.typesDocument);
      formData.append("identification", form.value.identification);
    } else {
      formData.append("email", form.value.email);
    }
    formData.append("password", form.value.password);
    const response = await signIn();
    if(response){
      //treat data and keys 🚥+
      router.push('/');
    }
  }
  loader.value = false;
}
</script>
<template>
  <v-form class="d-flex justify-center align-center h-screen" ref="formRef">
    <v-card width="512" :loading="loader">
      <v-card-title> Inicio de sesión </v-card-title>
      <v-card-subtitle>
        <v-switch
          v-model="typeAuth"
          :label="
            'Ingreso por ' + (typeAuth ? 'correo' : 'número de documento')
          "
          :color="typeAuth ? 'orange' : 'primary'"
        ></v-switch>
      </v-card-subtitle>
      <v-card-text>
        <v-row>
          <v-col cols="12" v-if="typeAuth">
            <v-text-field
              label="Correo"
              :rules="rulesValidation.email"
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="6" v-if="!typeAuth">
            <v-select
              :items="typesDocument"
              label="Tipo de documento"
              v-model="form.typesDocument"
              item-title="label"
              item-value="name"
              :rules="rulesValidation.select"
            ></v-select>
          </v-col>
          <v-col cols="12" sm="6" v-if="!typeAuth">
            <v-text-field
              label="Identificación"
              v-model="form.identification"
              :rules="rulesValidation.identification"
            >
            </v-text-field>
          </v-col>
          <v-col cols="12">
            <v-text-field
              label="password"
              type="password"
              :rules="rulesValidation.password"
              v-model="form.password"
            ></v-text-field>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-btn color="orange" @click="logIn"> Iniciar </v-btn>
      </v-card-actions>
    </v-card>
  </v-form>
</template>
