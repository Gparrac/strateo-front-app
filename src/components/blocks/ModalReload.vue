<template>
  <v-dialog v-model="toggle"  width="auto" scrollable>
    <v-card>
      <v-card-title>Copia de seguridad</v-card-title>
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
          @click="sendResponse(false)"
        >
          Cancelar
        </v-btn>
        <v-btn color="blue-darken-1" variant="text" @click="sendResponse(true)">
          Confirmar
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  data: () => ({
    toggle:false
  }),

  methods: {
    sendResponse(kind) {
      this.$emit('reload-form-data', kind);
      this.toggle = false;
    }
  },
  mounted(){
    if(localStorage.getItem("formData") !== null)
      this.toggle= true;
  }
};
</script>

