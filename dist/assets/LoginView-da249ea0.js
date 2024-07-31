import{_ as c,R as g,K as y,az as w,aO as A,aA as v,m as n,n as C,q as t,w as s,X as k,S,aE as D,H as b,V as I,aP as U,z as i,P as $,aJ as P,aK as r,aQ as T,M as d,Y as u,T as m,Z as M,D as N,N as f,U as B}from"./index-afed4ac0.js";import{A as L}from"./AlertMessage-952e4388.js";const F=new D,R=new b,j={name:"LoginView",components:{AlertMessage:L},data:()=>({typeAuth:!1,form:{},typesDocument:[],loader:!1,rulesValidation:g,showPassword:!1}),mounted(){this.getTypeDocument()},computed:{...y(A,w)},methods:{async getTypeDocument(){const e=await F.get("/type-document-user");this.typesDocument=e.data},async logIn(){this.loader=!0;const{valid:e}=await this.$refs.form.validate();if(e){const a=new FormData;this.typeAuth?a.append("email",this.form.email):(a.append("type_document",this.form.typesDocument),a.append("identification",this.form.identification)),a.append("password",this.form.password);const p=await this.$recaptcha("login");a.append("recaptcha_key",p);const l=await R.login(a);l.statusResponse!=200?l.error&&typeof l.error=="object"?this.alertMessageStore.show(!1,"Verifica los campos.",l.error):this.alertMessageStore.show(!1,"Error en el servidor."):(this.alertMessageStore.show(!0,"Autenticación exitosa!"),this.userAuthStore.saveCredentials({user:l.user,...l.data}),localStorage.setItem("auth-token",l.data.access_token),localStorage.setItem("user",JSON.stringify(l.user)),this.$router.push("/"))}this.loader=!1}}},z={class:"d-flex justify-end"};function E(e,a,p,l,O,h){const V=v("alert-message");return n(),C(S,null,[t(V),t(k,{class:"d-flex justify-center align-center h-screen",ref:"form"},{default:s(()=>[t(I,{width:"512",loading:e.loader},{default:s(()=>[t(U,{class:"text-h3 pt-5 text-center"},{default:s(()=>[i(" Inicio de sesión ")]),_:1}),t($,null,{default:s(()=>[t(P,null,{default:s(()=>[t(r,{cols:"12"},{default:s(()=>[t(T,{modelValue:e.typeAuth,"onUpdate:modelValue":a[0]||(a[0]=o=>e.typeAuth=o),label:"Ingreso por "+(e.typeAuth?"correo":"número de documento"),color:e.typeAuth?"orange":"primary"},null,8,["modelValue","label","color"])]),_:1}),e.typeAuth?(n(),d(r,{key:0,cols:"12"},{default:s(()=>[t(u,{maxlength:e.rulesValidation.email.maxLength,label:"Correo",modelValue:e.form.email,"onUpdate:modelValue":a[1]||(a[1]=o=>e.form.email=o),rules:e.rulesValidation.email.rules,variant:"outlined"},null,8,["maxlength","modelValue","rules"])]),_:1})):m("",!0),e.typeAuth?m("",!0):(n(),d(r,{key:1,cols:"12",sm:"6"},{default:s(()=>[t(M,{items:e.typesDocument,label:"Tipo de documento",modelValue:e.form.typesDocument,"onUpdate:modelValue":a[2]||(a[2]=o=>e.form.typesDocument=o),"item-title":"label","item-value":"name",rules:e.rulesValidation.select.rules,variant:"outlined"},null,8,["items","modelValue","rules"])]),_:1})),e.typeAuth?m("",!0):(n(),d(r,{key:2,cols:"12",sm:"6"},{default:s(()=>[t(u,{maxlength:e.rulesValidation.identification.maxLength,label:"Identificación",modelValue:e.form.identification,"onUpdate:modelValue":a[3]||(a[3]=o=>e.form.identification=o),rules:e.rulesValidation.identification.rules,variant:"outlined"},null,8,["maxlength","modelValue","rules"])]),_:1})),t(r,{cols:"12"},{default:s(()=>[t(u,{maxlength:e.rulesValidation.password.maxLength,label:"Contraseña",rules:e.rulesValidation.password.rules,"append-inner-icon":e.showPassword?"mdi-eye-off":"mdi-eye",type:e.showPassword?"text":"password","onClick:appendInner":a[4]||(a[4]=o=>e.showPassword=!e.showPassword),modelValue:e.form.password,"onUpdate:modelValue":a[5]||(a[5]=o=>e.form.password=o),variant:"outlined"},null,8,["maxlength","rules","append-inner-icon","type","modelValue"])]),_:1}),t(r,{cols:"12"})]),_:1}),N("div",z,[t(f,{variant:"text",class:"text-right text-orange text-body-2",size:"sm",onClick:a[6]||(a[6]=o=>e.$router.push("recovery-password"))},{default:s(()=>[i("Olvidaste tu contraseña?")]),_:1})])]),_:1}),t(B,null,{default:s(()=>[t(f,{color:"orange",onClick:h.logIn},{default:s(()=>[i(" Iniciar ")]),_:1},8,["onClick"])]),_:1})]),_:1},8,["loading"])]),_:1},512)],64)}const q=c(j,[["render",E]]);export{q as default};
