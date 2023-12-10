import { defineStore } from 'pinia'
import { ref } from 'vue';

export const useModalStore = defineStore('modal', () => {
  const toggle = ref(false);
  const kind = ref('');
  const data = ref({});

  function activeModal(item, type){
    toggle.value = !toggle.value;
    data.value = item;
    kind.value = type;
    console.log('actived°',item,type)
  }
  return {toggle, data, kind, activeModal}
});
