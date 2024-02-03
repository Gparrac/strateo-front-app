import{aP as L,p as z,aQ as E,K as F,aR as N,aS as R,S as O,aT as Q,aU as W,T as Y,Q as Z,L as j,aV as q,M as G,a4 as J,c,N as K,aW as U,aX as X,aY as H,Y as ee,aZ as ae,a_ as te,Z as se,a$ as le,W as oe,b0 as ne,q as t,b1 as re,B as ie,a1 as k,aa as ce,a7 as de,am as ue,av as ve,_ as me,m as d,ap as ye,w as u,t as _e,v as fe,D as v,F as g,n as S,as as be,ai as ke,G as ge,z as Se,I as pe,J as Ve}from"./index-f4d1f676.js";const Pe=L("v-alert-title"),he=["success","info","warning","error"],Ce=z({border:{type:[Boolean,String],validator:e=>typeof e=="boolean"||["top","end","bottom","start"].includes(e)},borderColor:String,closable:Boolean,closeIcon:{type:E,default:"$close"},closeLabel:{type:String,default:"$vuetify.close"},icon:{type:[Boolean,String,Function,Object],default:null},modelValue:{type:Boolean,default:!0},prominent:Boolean,title:String,text:String,type:{type:String,validator:e=>he.includes(e)},...F(),...N(),...R(),...O(),...Q(),...W(),...Y(),...Z(),...j(),...q({variant:"flat"})},"VAlert"),xe=G()({name:"VAlert",props:Ce(),emits:{"click:close":e=>!0,"update:modelValue":e=>!0},setup(e,m){let{emit:y,slots:a}=m;const n=J(e,"modelValue"),s=c(()=>{if(e.icon!==!1)return e.type?e.icon??`$${e.type}`:e.icon}),r=c(()=>({color:e.color??e.type,variant:e.variant})),{themeClasses:o}=K(e),{colorClasses:p,colorStyles:V,variantClasses:P}=U(r),{densityClasses:h}=X(e),{dimensionStyles:C}=H(e),{elevationClasses:x}=ee(e),{locationStyles:A}=ae(e),{positionClasses:B}=te(e),{roundedClasses:I}=se(e),{textColorClasses:T,textColorStyles:$}=le(oe(e,"borderColor")),{t:M}=ne(),_=c(()=>({"aria-label":M(e.closeLabel),onClick(i){n.value=!1,y("click:close",i)}}));return()=>{const i=!!(a.prepend||s.value),D=!!(a.title||e.title),w=!!(a.close||e.closable);return n.value&&t(e.tag,{class:["v-alert",e.border&&{"v-alert--border":!!e.border,[`v-alert--border-${e.border===!0?"start":e.border}`]:!0},{"v-alert--prominent":e.prominent},o.value,p.value,h.value,x.value,B.value,I.value,P.value,e.class],style:[V.value,C.value,A.value,e.style],role:"alert"},{default:()=>{var f,b;return[re(!1,"v-alert"),e.border&&t("div",{key:"border",class:["v-alert__border",T.value],style:$.value},null),i&&t("div",{key:"prepend",class:"v-alert__prepend"},[a.prepend?t(k,{key:"prepend-defaults",disabled:!s.value,defaults:{VIcon:{density:e.density,icon:s.value,size:e.prominent?44:28}}},a.prepend):t(ie,{key:"prepend-icon",density:e.density,icon:s.value,size:e.prominent?44:28},null)]),t("div",{class:"v-alert__content"},[D&&t(Pe,{key:"title"},{default:()=>{var l;return[((l=a.title)==null?void 0:l.call(a))??e.title]}}),((f=a.text)==null?void 0:f.call(a))??e.text,(b=a.default)==null?void 0:b.call(a)]),a.append&&t("div",{key:"append",class:"v-alert__append"},[a.append()]),w&&t("div",{key:"close",class:"v-alert__close"},[a.close?t(k,{key:"close-defaults",defaults:{VBtn:{icon:e.closeIcon,size:"x-small",variant:"text"}}},{default:()=>{var l;return[(l=a.close)==null?void 0:l.call(a,{props:_.value})]}}):t(ce,de({key:"close-btn",icon:e.closeIcon,size:"x-small",variant:"text"},_.value),null)])]}})}}}),Ae={data:()=>({}),computed:{...ue(ve)}},Be=e=>(pe("data-v-2b62210a"),e=e(),Ve(),e),Ie={class:"text-h6"},Te={class:"pt-2"},$e=Be(()=>v("br",null,null,-1));function Me(e,m,y,a,n,s){return d(),ye(ge,null,{default:u(()=>[_e(t(xe,{type:e.alertMessageStore.them,icon:e.alertMessageStore.kind?"mdi-check-circle":"mdi-block-helper",variant:"tonal",border:"start",class:"custom-alert"},{title:u(()=>[v("p",Ie,g(e.alertMessageStore.message),1)]),default:u(()=>[v("div",Te,[(d(!0),S(ke,null,be(e.alertMessageStore.listErrors,(r,o)=>(d(),S("small",{key:o,class:"text-orange"},[Se(g(o+1+". "+r)+" ",1),$e]))),128))])]),_:1},8,["type","icon"]),[[fe,e.alertMessageStore.toggleAlert]])]),_:1})}const we=me(Ae,[["render",Me],["__scopeId","data-v-2b62210a"]]);export{we as A};