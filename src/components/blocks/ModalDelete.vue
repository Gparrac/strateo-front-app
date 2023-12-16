<template>
  <v-dialog
    v-model="modal"
    width="auto"
  >
  <v-card>
    <v-card-title>Confirmación de seguirdad</v-card-title>
    <v-title>Se inactivaran los siguientes componentes:</v-title>
    <v-card-text>
      <v-list lines="two">
  <v-list-item
    v-for="(item, i) in deleteItems"
    :key="item[mainKey]"
    :title="i + ' ' + item[mainKey]"
    :subtitle="item[secondKey]"
  ></v-list-item>
</v-list>
    </v-card-text>
    <v-card-actions>
      <v-btn
            color="blue-darken-1"
            variant="text"
            @click="$emit('confirm-delete',{confirm:false})"
          >
            Cancelar
          </v-btn>
          <v-btn
            color="blue-darken-1"
            variant="text"
            @click="dialog = $emit('confirm-delte',{confirm:true})"
          >
            Confirmar
          </v-btn>
    </v-card-actions>
  </v-card>
  </v-dialog>
</template>

<script>
export default {
    props:{
      deleteItems:Array,
      mainKey:String,
      secondKey:String
    },

}
</script>

<style>

</style>
