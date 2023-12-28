import{p as Z,aO as E,aP as G,B as H,C as b,aQ as K,aR as Q,r as q,c as A,d as _,ag as ee,aS as ae,aT as I,aU as P,P as a,T as D,a5 as te,aV as le,V as oe,aW as se,aX as ne,_ as ie,aG as re,U as ue,W as de,X as h,Y as p,Z as l,aH as me,aY as ce,aI as fe,a7 as w,aJ as Ve,aK as he,aL as d,aM as C,aF as k,aZ as pe,a1 as ge,S as T,aN as ve,aa as ye}from"./index-09ee82d7.js";import{A as we}from"./AuthUser-e7d62fd0.js";const Ce=Z({indeterminate:Boolean,inset:Boolean,flat:Boolean,loading:{type:[Boolean,String],default:!1},...E(),...G()},"VSwitch"),ke=H()({name:"VSwitch",inheritAttrs:!1,props:Ce(),emits:{"update:focused":e=>!0,"update:modelValue":e=>!0,"update:indeterminate":e=>!0},setup(e,t){let{attrs:m,slots:n}=t;const o=b(e,"indeterminate"),i=b(e,"modelValue"),{loaderClasses:s}=K(e),{isFocused:U,focus:B,blur:F}=Q(e),S=q(),L=A(()=>typeof e.loading=="string"&&e.loading!==""?e.loading:e.color),$=_(),N=A(()=>e.id||`switch-${$}`);function R(){o.value&&(o.value=!1)}function M(c){var f,V;c.stopPropagation(),c.preventDefault(),(V=(f=S.value)==null?void 0:f.input)==null||V.click()}return ee(()=>{const[c,f]=ae(m),V=I.filterProps(e),x=P.filterProps(e);return a(I,D({class:["v-switch",{"v-switch--inset":e.inset},{"v-switch--indeterminate":o.value},s.value,e.class]},c,V,{modelValue:i.value,"onUpdate:modelValue":g=>i.value=g,id:N.value,focused:U.value,style:e.style}),{...n,default:g=>{let{id:j,messagesId:z,isDisabled:O,isReadonly:J,isValid:W}=g;return a(P,D({ref:S},x,{modelValue:i.value,"onUpdate:modelValue":[u=>i.value=u,R],id:j.value,"aria-describedby":z.value,type:"checkbox","aria-checked":o.value?"mixed":void 0,disabled:O.value,readonly:J.value,onFocus:B,onBlur:F},f),{...n,default:u=>{let{backgroundColorClasses:v,backgroundColorStyles:r}=u;return a("div",{class:["v-switch__track",...v.value],style:r.value,onClick:M},null)},input:u=>{let{inputNode:v,icon:r,backgroundColorClasses:X,backgroundColorStyles:Y}=u;return a(te,null,[v,a("div",{class:["v-switch__thumb",{"v-switch__thumb--filled":r||e.loading},e.inset?void 0:X.value],style:e.inset?void 0:Y.value},[a(le,null,{default:()=>[e.loading?a(se,{name:"v-switch",active:!0,color:W.value===!1?void 0:L.value},{default:y=>n.loader?n.loader(y):a(ne,{active:y.isActive,color:y.color,indeterminate:!0,size:"16",width:"2"},null)}):r&&a(oe,{key:r,icon:r,size:"x-small"},null)]})])])}})}})}),{}}}),Se=new ce,be=new we,Ae={name:"LoginView",data:()=>({typeAuth:!1,form:{},typesDocument:[],loader:!1,rulesValidation:re}),mounted(){this.getTypeDocument()},computed:{...ue(de)},methods:{async getTypeDocument(){const e=await Se.get("/type-document-user");this.typesDocument=e.data},async logIn(){this.loader=!0;const{valid:e}=await this.$refs.form.validate();if(e){const n=new FormData;this.typeAuth?n.append("email",this.form.email):(n.append("type_document",this.form.typesDocument),n.append("identification",this.form.identification)),n.append("password",this.form.password);const o=await be.login(n);if(o.statusResponse!=200){var t=new URL(window.location.href),m=t.searchParams.has("error");o.error&&typeof o.error=="object"?this.alertMessageStore.show(!1,"Verifica los campos.",o.error):this.alertMessageStore.show(!1,"Error en el servidor."),m?window.location.reload(!0):(t.searchParams.set("error","true"),window.location.href=t.toString());return}this.alertMessageStore.show(!0,"Autenticación exitosa!"),localStorage.setItem("auth-token",o.data.access_token),localStorage.setItem("user",JSON.stringify(o.user)),this.$router.push("/")}this.loader=!1}}},Ie={class:"d-flex justify-end"};function Pe(e,t,m,n,o,i){return h(),p(me,{class:"d-flex justify-center align-center h-screen",ref:"form"},{default:l(()=>[a(ye,{width:"512",loading:e.loader},{default:l(()=>[a(fe,{class:"text-h3 pt-5 text-center"},{default:l(()=>[w(" Inicio de sesión ")]),_:1}),a(Ve,null,{default:l(()=>[a(he,null,{default:l(()=>[a(d,{cols:"12"},{default:l(()=>[a(ke,{modelValue:e.typeAuth,"onUpdate:modelValue":t[0]||(t[0]=s=>e.typeAuth=s),label:"Ingreso por "+(e.typeAuth?"correo":"número de documento"),color:e.typeAuth?"orange":"primary"},null,8,["modelValue","label","color"])]),_:1}),e.typeAuth?(h(),p(d,{key:0,cols:"12"},{default:l(()=>[a(C,{maxlength:e.rulesValidation.email.maxLength,label:"Correo",modelValue:e.form.email,"onUpdate:modelValue":t[1]||(t[1]=s=>e.form.email=s),rules:e.rulesValidation.email.rules},null,8,["maxlength","modelValue","rules"])]),_:1})):k("",!0),e.typeAuth?k("",!0):(h(),p(d,{key:1,cols:"12",sm:"6"},{default:l(()=>[a(pe,{items:e.typesDocument,label:"Tipo de documento",modelValue:e.form.typesDocument,"onUpdate:modelValue":t[2]||(t[2]=s=>e.form.typesDocument=s),"item-title":"label","item-value":"name",rules:e.rulesValidation.select.rules},null,8,["items","modelValue","rules"])]),_:1})),e.typeAuth?k("",!0):(h(),p(d,{key:2,cols:"12",sm:"6"},{default:l(()=>[a(C,{maxlength:e.rulesValidation.identification.maxLength,label:"Identificación",modelValue:e.form.identification,"onUpdate:modelValue":t[3]||(t[3]=s=>e.form.identification=s),rules:e.rulesValidation.identification.rules},null,8,["maxlength","modelValue","rules"])]),_:1})),a(d,{cols:"12"},{default:l(()=>[a(C,{maxlength:e.rulesValidation.password.maxLength,label:"Contraseña",type:"password",rules:e.rulesValidation.password.rules,modelValue:e.form.password,"onUpdate:modelValue":t[4]||(t[4]=s=>e.form.password=s)},null,8,["maxlength","rules","modelValue"])]),_:1})]),_:1}),ge("div",Ie,[a(T,{variant:"text",class:"text-right text-orange text-body-2",size:"sm",onClick:t[5]||(t[5]=s=>e.$router.push("recovery-password"))},{default:l(()=>[w("Olvidaste tu contraseña?")]),_:1})])]),_:1}),a(ve,null,{default:l(()=>[a(T,{color:"orange",onClick:i.logIn},{default:l(()=>[w(" Iniciar ")]),_:1},8,["onClick"])]),_:1})]),_:1},8,["loading"])]),_:1},512)}const Ue=ie(Ae,[["render",Pe]]);export{Ue as default};
