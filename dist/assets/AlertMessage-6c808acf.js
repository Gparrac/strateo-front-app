import{aS as L,p as z,aT as E,$ as F,aU as N,aV as R,a7 as j,aW as O,aX as q,a8 as G,a5 as J,a0 as K,aY as Q,a1 as U,aj as W,c as i,a2 as X,aZ as Y,a_ as Z,a$ as H,ac as ee,b0 as ae,b1 as te,ad as se,b2 as le,aa as oe,b3 as ne,q as t,b4 as re,B as ce,ag as k,N as ie,am as de,K as ue,aD as ve,_ as me,m as d,M as ye,w as u,t as _e,v as be,D as v,F as g,n as S,Q as fe,S as ke,G as ge,z as Se,I as pe,J as Ve}from"./index-56857116.js";const he=L("v-alert-title"),Pe=["success","info","warning","error"],Ce=z({border:{type:[Boolean,String],validator:e=>typeof e=="boolean"||["top","end","bottom","start"].includes(e)},borderColor:String,closable:Boolean,closeIcon:{type:E,default:"$close"},closeLabel:{type:String,default:"$vuetify.close"},icon:{type:[Boolean,String,Function,Object],default:null},modelValue:{type:Boolean,default:!0},prominent:Boolean,title:String,text:String,type:{type:String,validator:e=>Pe.includes(e)},...F(),...N(),...R(),...j(),...O(),...q(),...G(),...J(),...K(),...Q({variant:"flat"})},"VAlert"),xe=U()({name:"VAlert",props:Ce(),emits:{"click:close":e=>!0,"update:modelValue":e=>!0},setup(e,m){let{emit:y,slots:a}=m;const n=W(e,"modelValue"),s=i(()=>{if(e.icon!==!1)return e.type?e.icon??`$${e.type}`:e.icon}),r=i(()=>({color:e.color??e.type,variant:e.variant})),{themeClasses:o}=X(e),{colorClasses:p,colorStyles:V,variantClasses:h}=Y(r),{densityClasses:P}=Z(e),{dimensionStyles:C}=H(e),{elevationClasses:x}=ee(e),{locationStyles:A}=ae(e),{positionClasses:B}=te(e),{roundedClasses:$}=se(e),{textColorClasses:I,textColorStyles:M}=le(oe(e,"borderColor")),{t:T}=ne(),_=i(()=>({"aria-label":T(e.closeLabel),onClick(c){n.value=!1,y("click:close",c)}}));return()=>{const c=!!(a.prepend||s.value),D=!!(a.title||e.title),w=!!(a.close||e.closable);return n.value&&t(e.tag,{class:["v-alert",e.border&&{"v-alert--border":!!e.border,[`v-alert--border-${e.border===!0?"start":e.border}`]:!0},{"v-alert--prominent":e.prominent},o.value,p.value,P.value,x.value,B.value,$.value,h.value,e.class],style:[V.value,C.value,A.value,e.style],role:"alert"},{default:()=>{var b,f;return[re(!1,"v-alert"),e.border&&t("div",{key:"border",class:["v-alert__border",I.value],style:M.value},null),c&&t("div",{key:"prepend",class:"v-alert__prepend"},[a.prepend?t(k,{key:"prepend-defaults",disabled:!s.value,defaults:{VIcon:{density:e.density,icon:s.value,size:e.prominent?44:28}}},a.prepend):t(ce,{key:"prepend-icon",density:e.density,icon:s.value,size:e.prominent?44:28},null)]),t("div",{class:"v-alert__content"},[D&&t(he,{key:"title"},{default:()=>{var l;return[((l=a.title)==null?void 0:l.call(a))??e.title]}}),((b=a.text)==null?void 0:b.call(a))??e.text,(f=a.default)==null?void 0:f.call(a)]),a.append&&t("div",{key:"append",class:"v-alert__append"},[a.append()]),w&&t("div",{key:"close",class:"v-alert__close"},[a.close?t(k,{key:"close-defaults",defaults:{VBtn:{icon:e.closeIcon,size:"x-small",variant:"text"}}},{default:()=>{var l;return[(l=a.close)==null?void 0:l.call(a,{props:_.value})]}}):t(ie,de({key:"close-btn",icon:e.closeIcon,size:"x-small",variant:"text"},_.value),null)])]}})}}}),Ae={data:()=>({}),computed:{...ue(ve)}},Be=e=>(pe("data-v-2b62210a"),e=e(),Ve(),e),$e={class:"text-h6"},Ie={class:"pt-2"},Me=Be(()=>v("br",null,null,-1));function Te(e,m,y,a,n,s){return d(),ye(ge,null,{default:u(()=>[_e(t(xe,{type:e.alertMessageStore.them,icon:e.alertMessageStore.kind?"mdi-check-circle":"mdi-block-helper",variant:"tonal",border:"start",class:"custom-alert"},{title:u(()=>[v("p",$e,g(e.alertMessageStore.message),1)]),default:u(()=>[v("div",Ie,[(d(!0),S(ke,null,fe(e.alertMessageStore.listErrors,(r,o)=>(d(),S("small",{key:o,class:"text-orange"},[Se(g(o+1+". "+r)+" ",1),Me]))),128))])]),_:1},8,["type","icon"]),[[be,e.alertMessageStore.toggleAlert]])]),_:1})}const we=me(Ae,[["render",Te],["__scopeId","data-v-2b62210a"]]);export{we as A};
