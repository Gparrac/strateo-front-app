import{A as g}from"./AlertMessage-20460b40.js";import{_ as y,R as V,K as v,aO as C,aA as _,m as i,n as I,M as p,T as m,D as R,q as r,w as a,X as x,E as k,S as q,H as b,V as S,aP as A,z as l,F as c,O as M,P as N,aJ as B,Y as u,aK as w,U as F,N as f}from"./index-4a34fe44.js";const P=new b,T={components:{AlertMessage:g},data(){return{showPasswords:[!1,!1,!1],loading:!1,editItem:{},recoveryRequest:!1,rulesValidation:V}},computed:{confirmPasswordRule(){return[o=>!!o||"Contraseña es requerida",o=>o===this.editItem.newPassword||"Las contraseñas no coinciden"]},passwordRule(){return[o=>!!o||"Contraseña es requerida",o=>o!=this.editItem.oldPassword||"La nueva contraseña debe ser diferente a la anterior",o=>o&&o.length>=6||"Contraseña debe tener al menos 6 caracteres"]},...v(C)},created(){this.$route.name&&(this.recoveryRequest=!0)},methods:{async changePassword(){this.loading=!0;const{valid:o}=await this.$refs.form.validate();if(o){const s=new FormData;let n={};this.recoveryRequest?(s.append("password",this.editItem.newPassword),s.append("email",this.$route.query.email),s.append("token",this.$route.query.token),n=await P.changePassword(s)):(s.append("old_password",this.editItem.oldPassword),s.append("new_password",this.editItem.newPassword),n=await P.changePassword(s)),n.statusResponse!=200?n.error&&typeof n.error=="object"?this.alertMessageStore.show(!1,"Error en la petición",n.error):this.alertMessageStore.show(!1,"Error en el servidor."):this.alertMessageStore.show(!0,"Proceso exitoso!")}this.loading=!1}}};function U(o,s,n,D,e,d){const h=_("alert-message");return i(),I(q,null,[e.recoveryRequest?(i(),p(h,{key:0})):m("",!0),R("div",{class:k(e.recoveryRequest?"d-flex justify-center align-center h-screen":"")},[r(x,{class:"d-flex justify-center align-center",ref:"form"},{default:a(()=>[r(S,{width:"512",loading:e.loading},{default:a(()=>[r(A,{class:"text-h4 py-5 text-center"},{default:a(()=>[l(c(e.recoveryRequest?"Recuperación de credenciales":"Cambiar contraseña"),1)]),_:1}),r(M,null,{default:a(()=>[l(" Introduce las nueva contraseña para "+c(o.$route.query.email),1)]),_:1}),r(N,null,{default:a(()=>[r(B,null,{default:a(()=>[e.recoveryRequest?m("",!0):(i(),p(w,{key:0,cols:"12"},{default:a(()=>[r(u,{label:"Contraseña actual",autocomplete:"currently-password","append-inner-icon":e.showPasswords[0]?"mdi-eye-off":"mdi-eye",type:e.showPasswords[0]?"text":"password","onClick:appendInner":s[0]||(s[0]=t=>e.showPasswords[0]=!e.showPasswords[0]),rules:e.rulesValidation.password.rules,modelValue:e.editItem.oldPassword,"onUpdate:modelValue":s[1]||(s[1]=t=>e.editItem.oldPassword=t),variant:"outlined"},null,8,["append-inner-icon","type","rules","modelValue"])]),_:1})),r(w,{cols:"12"},{default:a(()=>[r(u,{autocomplete:"password",label:"Nueva contraseña","append-inner-icon":e.showPasswords[1]?"mdi-eye-off":"mdi-eye",type:e.showPasswords[1]?"text":"password","onClick:appendInner":s[2]||(s[2]=t=>e.showPasswords[1]=!e.showPasswords[1]),modelValue:e.editItem.newPassword,"onUpdate:modelValue":s[3]||(s[3]=t=>e.editItem.newPassword=t),rules:d.passwordRule,loading:e.loading,variant:"outlined"},null,8,["append-inner-icon","type","modelValue","rules","loading"])]),_:1}),r(w,{cols:"12"},{default:a(()=>[r(u,{autocomplete:"confirmPassword",label:"Confirmar contraseña","append-inner-icon":e.showPasswords[2]?"mdi-eye-off":"mdi-eye",type:e.showPasswords[2]?"text":"password","onClick:appendInner":s[4]||(s[4]=t=>e.showPasswords[2]=!e.showPasswords[2]),modelValue:e.editItem.confirmPassword,"onUpdate:modelValue":s[5]||(s[5]=t=>e.editItem.confirmPassword=t),rules:d.confirmPasswordRule,loading:e.loading,variant:"outlined"},null,8,["append-inner-icon","type","modelValue","rules","loading"])]),_:1})]),_:1})]),_:1}),r(F,null,{default:a(()=>[r(f,{color:"orange",onClick:d.changePassword},{default:a(()=>[l(" Guardar ")]),_:1},8,["onClick"]),r(f,{color:"orange",onClick:s[6]||(s[6]=t=>o.$router.push("/"))},{default:a(()=>[l(" Volver ")]),_:1})]),_:1})]),_:1},8,["loading"])]),_:1},512)],2)],64)}const z=y(T,[["render",U]]);export{z as default};
