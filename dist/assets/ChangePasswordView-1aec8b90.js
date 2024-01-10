import{A as m}from"./AuthUser-b6b5f57d.js";import{_ as w,aG as f,U as c,W as p,X as V,Y as g,Z as r,aH as h,P as a,aI as P,a7 as u,aJ as C,aK as I,aL as n,aM as i,aN as _,S as x,aa as b}from"./index-e07c50e3.js";const y=new m,R={data(){return{editItem:{},rulesValidation:f}},computed:{confirmPasswordRule(){return[e=>!!e||"Contraseña es requerida",e=>e===this.editItem.newPassword||"Las contraseñas no coinciden"]},passwordRule(){return[e=>!!e||"Contraseña es requerida",e=>e!=this.editItem.oldPassword||"La nueva contraseña debe ser diferente a la anterior",e=>e&&e.length>=6||"Contraseña debe tener al menos 6 caracteres"]},...c(p)},methods:{async changePassword(){this.loading=!0;const{valid:e}=await this.$refs.form.validate();if(e){const s=new FormData;let t={};s.append("old_password",this.editItem.oldPassword),s.append("new_password",this.editItem.newPassword),t=await y.changePassword(s),t.statusResponse!=200?t.error&&typeof t.error=="object"?this.alertMessageStore.show(!1,"Error en la petición",t.error):this.alertMessageStore.show(!1,"Error en el servidor."):this.alertMessageStore.show(!0,"Proceso exitoso!")}this.loading=!1}}};function S(e,s,t,A,o,d){return V(),g(h,{class:"d-flex justify-center align-center",ref:"form"},{default:r(()=>[a(b,{width:"512",loading:e.loader},{default:r(()=>[a(P,{class:"text-h4 py-5 text-center"},{default:r(()=>[u(" Cambiar contraseña ")]),_:1}),a(C,null,{default:r(()=>[a(I,null,{default:r(()=>[a(n,{cols:"12"},{default:r(()=>[a(i,{label:"Contraseña actual",type:"password",rules:o.rulesValidation.password.rules,modelValue:o.editItem.oldPassword,"onUpdate:modelValue":s[0]||(s[0]=l=>o.editItem.oldPassword=l)},null,8,["rules","modelValue"])]),_:1}),a(n,{cols:"12"},{default:r(()=>[a(i,{label:"Nueva contraseña",type:"password",modelValue:o.editItem.newPassword,"onUpdate:modelValue":s[1]||(s[1]=l=>o.editItem.newPassword=l),rules:d.passwordRule,loading:e.loading},null,8,["modelValue","rules","loading"])]),_:1}),a(n,{cols:"12"},{default:r(()=>[a(i,{label:"Confirmar contraseña",type:"password",modelValue:o.editItem.confirmPassword,"onUpdate:modelValue":s[2]||(s[2]=l=>o.editItem.confirmPassword=l),rules:d.confirmPasswordRule,loading:e.loading},null,8,["modelValue","rules","loading"])]),_:1})]),_:1})]),_:1}),a(_,null,{default:r(()=>[a(x,{color:"orange",onClick:d.changePassword},{default:r(()=>[u(" Guardar ")]),_:1},8,["onClick"])]),_:1})]),_:1},8,["loading"])]),_:1},512)}const k=w(R,[["render",S]]);export{k as default};