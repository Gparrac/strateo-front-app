<template>
  <div>
    <v-card class="w-100" >
      <template v-slot:title> {{title}} </template>
      <template v-slot:append>
        <v-avatar color="blue-darken-2">
          <v-icon :icon="icon"></v-icon>
        </v-avatar>
      </template>
      <v-card-text class="text-h3 py-5 mb-5"> {{value ?? '-'}} </v-card-text>
    </v-card>
  </div>
</template>
<script>
export default {
  props: {
    icon: {
      type: String,
      default: "mdi-shape",
    },
    title: {
      type: String,
      default: "-",
    },
    value: {
      type: Number,

    },
  },
};
</script>
