<template>
                  <v-file-input
                :model="item.file"
                accept=".doc, .docx, .pdf"
                :label="title"
                prepend-inner-icon="mdi-file-document"
                prepend-icon=""
                :rules="rulesValidation.file.rules"
                :loading="loading"
                @change="handleFileChange"
                @click:clear="cleanAttributes()"
                :hint="item.file +' ' +item.pathFile"
                variant="outlined"
              >
              <template v-slot:prepend>

              </template>
              <template v-slot:append>
                <v-btn
                        v-if="item.pathFile || item.file"
                        class="ma-2"
                        outlined
                        :href="getFileUrl(item.pathFile)"
                        target="_blank"
                        icon="mdi-folder-download"
                        size="small"
                        download
                      >
                      </v-btn>
            </template>
              </v-file-input>
</template>
<script>
  import { RulesValidation } from "@/utils/validations";
export default {
  props:{
    item: Object,
    loading: Boolean,
    title: {
      type: String,
      required: false,
      default: 'Archivo'
    }
  },
  data:() =>({
    rulesValidation: RulesValidation,
  }),
  methods:{
    handleFileChange(event) {
      const files = event.target.files;
      if (files.length > 0) {
        const selectedFile = files[0];
        console.log('changing', selectedFile);
        this.$emit('update:pathfile', selectedFile);
      }
    },
    getFileUrl(file) {
      if (!file) return "";
      if (typeof file === "string") return file;
      if (typeof file === "object") return URL.createObjectURL(file);
      return;
    },
    cleanAttributes(){
      console.log('entry-clean?')
      this.$emit('update:pathfile', null);
      this.$emit('update:file', null);
    }
  }
}
</script>
