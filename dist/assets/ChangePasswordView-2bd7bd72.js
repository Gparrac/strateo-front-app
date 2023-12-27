import{A as m}from"./AuthUser-9d9b8426.js";import{_ as c,aD as w,X as f,Y as p,Z as o,aE as V,P as a,aF as g,a6 as u,aG as h,aH as P,aI as n,aJ as i,aK as C,S as I,a3 as _}from"./index-d0d8ce67.js";const x=new m,y={data(){return{editItem:{},rulesValidation:w}},computed:{confirmPasswordRule(){return[e=>!!e||"Contraseña es requerida",e=>e===this.editItem.newPassword||"Las contraseñas no coinciden"]},passwordRule(){return[e=>!!e||"Contraseña es requerida",e=>e!=this.editItem.oldPassword||"La nueva contraseña debe ser diferente a la anterior",e=>e&&e.length>=6||"Contraseña debe tener al menos 6 caracteres"]}},methods:{async changePassword(){this.loading=!0;const{valid:e}=await this.$refs.form.validate();if(e){const s=new FormData;let l={};s.append("old_password",this.editItem.typeDocument),s.append("new_password",this.editItem.identification),l=await x.changePassword(s),l.error?this.alertMessageStore.show(!1,"Error en el servidor"):(this.alertMessageStore.show(!0,"Poceso exitoso!"),this.$router.push("/"))}this.loading=!1}}};function b(e,s,l,R,r,d){return f(),p(V,{class:"d-flex justify-center align-center",ref:"form"},{default:o(()=>[a(_,{width:"512",loading:e.loader},{default:o(()=>[a(g,{class:"text-h4 py-5 text-center"},{default:o(()=>[u(" Cambiar contraseña ")]),_:1}),a(h,null,{default:o(()=>[a(P,null,{default:o(()=>[a(n,{cols:"12"},{default:o(()=>[a(i,{label:"Contraseña actual",type:"password",rules:r.rulesValidation.password,modelValue:r.editItem.oldPassword,"onUpdate:modelValue":s[0]||(s[0]=t=>r.editItem.oldPassword=t)},null,8,["rules","modelValue"])]),_:1}),a(n,{cols:"12"},{default:o(()=>[a(i,{label:"Nueva contraseña",type:"password",modelValue:r.editItem.newPassword,"onUpdate:modelValue":s[1]||(s[1]=t=>r.editItem.newPassword=t),rules:d.passwordRule,loading:e.loading},null,8,["modelValue","rules","loading"])]),_:1}),a(n,{cols:"12"},{default:o(()=>[a(i,{label:"Confirmar contraseña",type:"password",modelValue:r.editItem.confirmPassword,"onUpdate:modelValue":s[2]||(s[2]=t=>r.editItem.confirmPassword=t),rules:d.confirmPasswordRule,loading:e.loading},null,8,["modelValue","rules","loading"])]),_:1})]),_:1})]),_:1}),a(C,null,{default:o(()=>[a(I,{color:"orange",onClick:d.changePassword},{default:o(()=>[u(" Guardar ")]),_:1},8,["onClick"])]),_:1})]),_:1},8,["loading"])]),_:1},512)}const A=c(y,[["render",b]]);export{A as default};