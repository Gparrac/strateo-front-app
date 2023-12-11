<!-- eslint-disable vue/no-mutating-props -->
<template>
  <v-row justify="center">
    <v-dialog v-model="modalStore.toggleModal" persistent width="512">
      <v-card>
        <v-card-title>
          <span class="text-h5">{{ modalStore.title }}</span>
        </v-card-title>
        <v-card-text v-if="modalStore.kindModal != 'delete'">
          <v-card>
            <v-card-text>
            <v-row>
              <v-col cols="12" sm="6">
                <v-select
                  :items="['0-17', '18-29', '30-54', '54+']"
                  label="Tipo de documento"
                  v-model="modalStore.data.typeDocument"
                  required
                ></v-select>

              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field label="Do
                cumento" v-model="modalStore.data.identification" required></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" >
                <v-text-field label="Nombres" v-model="modalStore.data.names" required></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" >
                <v-text-field label="Apellidos" v-model="modalStore.data.surnames" required></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" >
                <v-text-field label="Email" v-model="modalStore.data.email" required></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" >
                <v-text-field label="Telefono" v-model="modalStore.data.mobile" required></v-text-field>
              </v-col>
              <v-col cols="12" >
                <v-select
                  :items="['0-17', '18-29', '30-54', '54+']"
                  label="Ciudad"
                  v-model="modalStore.data.city"
                  required
                ></v-select>
              </v-col>

            </v-row>
          </v-card-text>

          </v-card>
            <v-card title="Usuario"  variant="outlined" padding="2">
              <v-card-text>
            <v-row>
              <v-col cols="12" sm="6" >
                <v-text-field label="Nombre de usuario" v-model="modalStore.data.name" required></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" >
                <v-text-field label="Contraseña" type="password" v-model="modalStore.data.password" required></v-text-field>
              </v-col>
              <v-col cols="12" >
                <v-text-field label="Confirmar contraseña" type="password" required v-model="modalStore.data.confirmPassword"></v-text-field>
              </v-col>
            </v-row>
          </v-card-text>
            </v-card>

          <small>*indicates required field</small>
        </v-card-text>
        <v-card-text v-if="modalStore.kindModal == 'delete'">
            Estas seguro que deseas eliminar {{modalStore.usersSelected.length == 1 ? modalStore.usersSelected.length + ' usuario' :  modalStore.usersSelected.length + ' usuarios' }}?
          </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue-darken-1" variant="text" @click="modalStore.hiddenModal">
            Close
          </v-btn>
          <v-btn color="blue-darken-1" variant="text" @click="submit">
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>
<script setup>

import { useModalStore } from "@/store/users";

const modalStore = useModalStore();




function submit(){
  console.log('tem',modalStore.data);
}



</script>
