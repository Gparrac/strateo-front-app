<!-- eslint-disable vue/no-mutating-props -->
<template>
  <v-row justify="center">
    <v-dialog v-model="props.modal" persistent width="512">
      <v-card>
        <v-card-title>
          <span class="text-h5">{{ title }}</span>
        </v-card-title>
        <v-card-text v-if="props.kindModal == 'create'">
          <v-card>
            <v-card-text>
            <v-row>
              <v-col cols="12" sm="6">
                <v-select
                  :items="['0-17', '18-29', '30-54', '54+']"
                  label="Tipo de documento"
                  v-model="form.typeDocument"
                  required
                ></v-select>

              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field label="Do
                cumento" v-model="form.identification" required></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" >
                <v-text-field label="Nombres" v-model="form.names" required></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" >
                <v-text-field label="Apellidos" v-model="form.surnames" required></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" >
                <v-text-field label="Email" v-model="form.email" required></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" >
                <v-text-field label="Telefono" v-model="form.mobile" required></v-text-field>
              </v-col>
              <v-col cols="12" >
                <v-select
                  :items="['0-17', '18-29', '30-54', '54+']"
                  label="Ciudad"
                  v-model="form.city"
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
                <v-text-field label="Nombre de usuario" v-model="form.name" required></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" >
                <v-text-field label="Contraseña" type="password" v-model="form.password" required></v-text-field>
              </v-col>
              <v-col cols="12" >
                <v-text-field label="Confirmar contraseña" type="password" required v-model="form.confirmPassword"></v-text-field>
              </v-col>
            </v-row>
          </v-card-text>
            </v-card>

          <small>*indicates required field</small>
        </v-card-text>
        <v-card-text v-if="props.modal == 'delete'">
            Estas seguro que deseas los usuarios seleccionados ?
          </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue-darken-1" variant="text" @click="$emit('hidden-form')">
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
import { computed, reactive } from "vue";
import {defineProps} from 'vue';
const props = defineProps({modal:Boolean,item:Object,kindModal:String});
let form = reactive(props.item);
console.log('form',form.value)
const title = computed(() =>{
  switch (props.kindModal) {
    case 'edit':
      return 'Edición de usuario';
    case 'create':
      return 'Creación de usuario';
    default:
      return 'Eliminación';
  }
});
function submit(){

}



</script>
