import{aJ as L,p as z,aK as E,$ as F,aL as N,aM as R,a7 as O,aN as j,aO as J,a8 as K,a5 as Q,a0 as q,aP as G,a1 as U,aj as W,c as i,a2 as X,aQ as H,aR as Y,aS as Z,ac as ee,aT as ae,aU as te,ad as se,aV as le,aa as oe,aW as ne,q as t,aX as re,B as ce,ag as g,N as ie,am as de,K as ue,aD as ve,_ as me,m as d,M as ye,w as u,t as _e,v as fe,D as v,F as b,n as S,Q as ke,S as ge,G as be,z as Se,I as pe,J as Ve}from"./index-f29128ce.js";const Pe=L("v-alert-title"),he=["success","info","warning","error"],Ce=z({border:{type:[Boolean,String],validator:e=>typeof e=="boolean"||["top","end","bottom","start"].includes(e)},borderColor:String,closable:Boolean,closeIcon:{type:E,default:"$close"},closeLabel:{type:String,default:"$vuetify.close"},icon:{type:[Boolean,String,Function,Object],default:null},modelValue:{type:Boolean,default:!0},prominent:Boolean,title:String,text:String,type:{type:String,validator:e=>he.includes(e)},...F(),...N(),...R(),...O(),...j(),...J(),...K(),...Q(),...q(),...G({variant:"flat"})},"VAlert"),xe=U()({name:"VAlert",props:Ce(),emits:{"click:close":e=>!0,"update:modelValue":e=>!0},setup(e,m){let{emit:y,slots:a}=m;const n=W(e,"modelValue"),s=i(()=>{if(e.icon!==!1)return e.type?e.icon??`$${e.type}`:e.icon}),r=i(()=>({color:e.color??e.type,variant:e.variant})),{themeClasses:o}=X(e),{colorClasses:p,colorStyles:V,variantClasses:P}=H(r),{densityClasses:h}=Y(e),{dimensionStyles:C}=Z(e),{elevationClasses:x}=ee(e),{locationStyles:A}=ae(e),{positionClasses:B}=te(e),{roundedClasses:I}=se(e),{textColorClasses:M,textColorStyles:$}=le(oe(e,"borderColor")),{t:T}=ne(),_=i(()=>({"aria-label":T(e.closeLabel),onClick(c){n.value=!1,y("click:close",c)}}));return()=>{const c=!!(a.prepend||s.value),D=!!(a.title||e.title),w=!!(a.close||e.closable);return n.value&&t(e.tag,{class:["v-alert",e.border&&{"v-alert--border":!!e.border,[`v-alert--border-${e.border===!0?"start":e.border}`]:!0},{"v-alert--prominent":e.prominent},o.value,p.value,h.value,x.value,B.value,I.value,P.value,e.class],style:[V.value,C.value,A.value,e.style],role:"alert"},{default:()=>{var f,k;return[re(!1,"v-alert"),e.border&&t("div",{key:"border",class:["v-alert__border",M.value],style:$.value},null),c&&t("div",{key:"prepend",class:"v-alert__prepend"},[a.prepend?t(g,{key:"prepend-defaults",disabled:!s.value,defaults:{VIcon:{density:e.density,icon:s.value,size:e.prominent?44:28}}},a.prepend):t(ce,{key:"prepend-icon",density:e.density,icon:s.value,size:e.prominent?44:28},null)]),t("div",{class:"v-alert__content"},[D&&t(Pe,{key:"title"},{default:()=>{var l;return[((l=a.title)==null?void 0:l.call(a))??e.title]}}),((f=a.text)==null?void 0:f.call(a))??e.text,(k=a.default)==null?void 0:k.call(a)]),a.append&&t("div",{key:"append",class:"v-alert__append"},[a.append()]),w&&t("div",{key:"close",class:"v-alert__close"},[a.close?t(g,{key:"close-defaults",defaults:{VBtn:{icon:e.closeIcon,size:"x-small",variant:"text"}}},{default:()=>{var l;return[(l=a.close)==null?void 0:l.call(a,{props:_.value})]}}):t(ie,de({key:"close-btn",icon:e.closeIcon,size:"x-small",variant:"text"},_.value),null)])]}})}}}),Ae={data:()=>({}),computed:{...ue(ve)}},Be=e=>(pe("data-v-2b62210a"),e=e(),Ve(),e),Ie={class:"text-h6"},Me={class:"pt-2"},$e=Be(()=>v("br",null,null,-1));function Te(e,m,y,a,n,s){return d(),ye(be,null,{default:u(()=>[_e(t(xe,{type:e.alertMessageStore.them,icon:e.alertMessageStore.kind?"mdi-check-circle":"mdi-block-helper",variant:"tonal",border:"start",class:"custom-alert"},{title:u(()=>[v("p",Ie,b(e.alertMessageStore.message),1)]),default:u(()=>[v("div",Me,[(d(!0),S(ge,null,ke(e.alertMessageStore.listErrors,(r,o)=>(d(),S("small",{key:o,class:"text-orange"},[Se(b(o+1+". "+r)+" ",1),$e]))),128))])]),_:1},8,["type","icon"]),[[fe,e.alertMessageStore.toggleAlert]])]),_:1})}const we=me(Ae,[["render",Te],["__scopeId","data-v-2b62210a"]]);export{we as A};