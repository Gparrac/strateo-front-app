<template>
  <v-dialog :model-value="toggle"  width="auto" scrollable persistent>
    <v-card>
      <v-card-title>Copia de seguridad {{ toggle }}</v-card-title>
      <v-card-subtitle
        class="pb-5">¿ Olvidaste guardar los cambios?
        </v-card-subtitle
      >
      <v-card-text >
        Se encontro un borrador de este formulario. ¿Deseas restablecer la información ?
      </v-card-text>
      <v-card-actions >
        <v-btn
          color="blue-darken-1"
          variant="text"
          @click="$emit('update:toggles', false)"
          :loading="loading"
        >
          Cancelar
        </v-btn>
        <v-btn color="blue-darken-1" variant="text" @click="$emit('update:toggles', true)" :loading="loading">
          Confirmar
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props:{
    toggle: Boolean,
    loading: Boolean

  },


  methods: {
  },

};
</script>

