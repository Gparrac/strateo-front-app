<template>
<v-btn
@click="startConnection"
:color="googleAccount ? 'success' : 'primary'"
>
  {{ googleAccount ? 'Cuenta de google enlazada' : 'Conectar cuenta de google'}}
</v-btn>
</template>
<script>
import Petition from '@/services/PetitionStructure/Petition'
const petition = new Petition();
export default {
  props:{
    userAuth: Boolean,
    googleAccount: Object,
  },
  methods: {
      async startConnection(){
        try{
          const response = await petition.get('/google/redirect');
          window.location.href = response.data;
        }catch(error){
          console.error('error', error);
        }

      }
    },
    mounted(){
    }
}
</script>
