import{p as L,i as _e,c as d,r as ce,a as J,u as ot,g as De,s as $,o as ve,b as Ue,d as st,e as it,f as ut,h as de,j as N,k as rt,l as ct,I as vt,m as X,n as dt,q as mt,t as ke,v as ft,w as gt,x as Ce,y as ee,z as me,A as yt,B as R,C as Te,D as fe,E as ht,F as bt,G as pt,H as Be,J as St,K as wt,L as Ie,M as Vt,N as Z,O as xt,P as o,Q as _t,V as Q,R as G,S as $e,T as q,U as kt,W as Ct,_ as Me,X as W,Y as pe,Z as _,$ as Ye,a0 as We,a1 as Ae,a2 as se,a3 as Tt,a4 as Xe,a5 as Fe,a6 as Se,a7 as we,a8 as Ve,a9 as U,aa as Le,ab as z,ac as je,ad as xe,ae as Ze,af as qe,ag as Bt,ah as It,ai as H,aj as ie,ak as Pe,al as $t,am as Mt,an as At,ao as Lt,ap as Pt,aq as Et,ar as Rt,as as Nt,at as Ht,au as ue,av as zt,aw as Ot,ax as Dt,ay as be,az as Ut,aA as Yt,aB as oe,aC as Re}from"./index-d0d8ce67.js";import{A as Ke}from"./AuthUser-9d9b8426.js";const re=Symbol.for("vuetify:layout"),Je=Symbol.for("vuetify:layout-item"),Ne=1e3,Ge=L({overlaps:{type:Array,default:()=>[]},fullHeight:Boolean},"layout"),Qe=L({name:{type:String},order:{type:[Number,String],default:0},absolute:Boolean},"layout-item");function Wt(){const e=_e(re);if(!e)throw new Error("[Vuetify] Could not find injected layout");return{getLayoutItem:e.getLayoutItem,mainRect:e.mainRect,mainStyles:e.mainStyles}}function et(e){const s=_e(re);if(!s)throw new Error("[Vuetify] Could not find injected layout");const a=e.id??`layout-item-${st()}`,n=De("useLayoutItem");Ue(Je,{id:a});const l=$(!1);it(()=>l.value=!0),ut(()=>l.value=!1);const{layoutItemStyles:t,layoutItemScrimStyles:r}=s.register(n,{...e,active:d(()=>l.value?!1:e.active.value),id:a});return de(()=>s.unregister(a)),{layoutItemStyles:t,layoutRect:s.layoutRect,layoutItemScrimStyles:r}}const Xt=(e,s,a,n)=>{let l={top:0,left:0,right:0,bottom:0};const t=[{id:"",layer:{...l}}];for(const r of e){const g=s.get(r),b=a.get(r),c=n.get(r);if(!g||!b||!c)continue;const i={...l,[g.value]:parseInt(l[g.value],10)+(c.value?parseInt(b.value,10):0)};t.push({id:r,layer:i}),l=i}return t};function tt(e){const s=_e(re,null),a=d(()=>s?s.rootZIndex.value-100:Ne),n=ce([]),l=J(new Map),t=J(new Map),r=J(new Map),g=J(new Map),b=J(new Map),{resizeRef:c,contentRect:i}=ot(),h=d(()=>{const u=new Map,f=e.overlaps??[];for(const v of f.filter(V=>V.includes(":"))){const[V,S]=v.split(":");if(!n.value.includes(V)||!n.value.includes(S))continue;const A=l.get(V),P=l.get(S),Y=t.get(V),O=t.get(S);!A||!P||!Y||!O||(u.set(S,{position:A.value,amount:parseInt(Y.value,10)}),u.set(V,{position:P.value,amount:-parseInt(O.value,10)}))}return u}),m=d(()=>{const u=[...new Set([...r.values()].map(v=>v.value))].sort((v,V)=>v-V),f=[];for(const v of u){const V=n.value.filter(S=>{var A;return((A=r.get(S))==null?void 0:A.value)===v});f.push(...V)}return Xt(f,l,t,g)}),y=d(()=>!Array.from(b.values()).some(u=>u.value)),x=d(()=>m.value[m.value.length-1].layer),k=d(()=>({"--v-layout-left":N(x.value.left),"--v-layout-right":N(x.value.right),"--v-layout-top":N(x.value.top),"--v-layout-bottom":N(x.value.bottom),...y.value?void 0:{transition:"none"}})),B=d(()=>m.value.slice(1).map((u,f)=>{let{id:v}=u;const{layer:V}=m.value[f],S=t.get(v),A=l.get(v);return{id:v,...V,size:Number(S.value),position:A.value}})),w=u=>B.value.find(f=>f.id===u),C=De("createLayout"),T=$(!1);ve(()=>{T.value=!0}),Ue(re,{register:(u,f)=>{let{id:v,order:V,position:S,layoutSize:A,elementSize:P,active:Y,disableTransitions:O,absolute:ge}=f;r.set(v,V),l.set(v,S),t.set(v,A),g.set(v,Y),O&&b.set(v,O);const te=rt(Je,C==null?void 0:C.vnode).indexOf(u);te>-1?n.value.splice(te,0,v):n.value.push(v);const ae=d(()=>B.value.findIndex(D=>D.id===v)),K=d(()=>a.value+m.value.length*2-ae.value*2),M=d(()=>{const D=S.value==="left"||S.value==="right",F=S.value==="right",ne=S.value==="bottom",Ee={[S.value]:0,zIndex:K.value,transform:`translate${D?"X":"Y"}(${(Y.value?0:-110)*(F||ne?-1:1)}%)`,position:ge.value||a.value!==Ne?"absolute":"fixed",...y.value?void 0:{transition:"none"}};if(!T.value)return Ee;const E=B.value[ae.value];if(!E)throw new Error(`[Vuetify] Could not find layout item "${v}"`);const he=h.value.get(v);return he&&(E[he.position]+=he.amount),{...Ee,height:D?`calc(100% - ${E.top}px - ${E.bottom}px)`:P.value?`${P.value}px`:void 0,left:F?void 0:`${E.left}px`,right:F?`${E.right}px`:void 0,top:S.value!=="bottom"?`${E.top}px`:void 0,bottom:S.value!=="top"?`${E.bottom}px`:void 0,width:D?P.value?`${P.value}px`:void 0:`calc(100% - ${E.left}px - ${E.right}px)`}}),le=d(()=>({zIndex:K.value-1}));return{layoutItemStyles:M,layoutItemScrimStyles:le,zIndex:K}},unregister:u=>{r.delete(u),l.delete(u),t.delete(u),g.delete(u),b.delete(u),n.value=n.value.filter(f=>f!==u)},mainRect:x,mainStyles:k,getLayoutItem:w,items:B,layoutRect:i,rootZIndex:a});const I=d(()=>["v-layout",{"v-layout--full-height":e.fullHeight}]),p=d(()=>({zIndex:s?a.value:void 0,position:s?"relative":void 0,overflow:s?"hidden":void 0}));return{layoutClasses:I,layoutStyles:p,getLayoutItem:w,items:B,layoutRect:i,layoutRef:c}}const Ft=ct("v-alert-title"),jt=["success","info","warning","error"],Zt=L({border:{type:[Boolean,String],validator:e=>typeof e=="boolean"||["top","end","bottom","start"].includes(e)},borderColor:String,closable:Boolean,closeIcon:{type:vt,default:"$close"},closeLabel:{type:String,default:"$vuetify.close"},icon:{type:[Boolean,String,Function,Object],default:null},modelValue:{type:Boolean,default:!0},prominent:Boolean,title:String,text:String,type:{type:String,validator:e=>jt.includes(e)},...X(),...dt(),...mt(),...ke(),...ft(),...gt(),...Ce(),...ee(),...me(),...yt({variant:"flat"})},"VAlert"),qt=R()({name:"VAlert",props:Zt(),emits:{"click:close":e=>!0,"update:modelValue":e=>!0},setup(e,s){let{emit:a,slots:n}=s;const l=Te(e,"modelValue"),t=d(()=>{if(e.icon!==!1)return e.type?e.icon??`$${e.type}`:e.icon}),r=d(()=>({color:e.color??e.type,variant:e.variant})),{themeClasses:g}=fe(e),{colorClasses:b,colorStyles:c,variantClasses:i}=ht(r),{densityClasses:h}=bt(e),{dimensionStyles:m}=pt(e),{elevationClasses:y}=Be(e),{locationStyles:x}=St(e),{positionClasses:k}=wt(e),{roundedClasses:B}=Ie(e),{textColorClasses:w,textColorStyles:C}=Vt(Z(e,"borderColor")),{t:T}=xt(),I=d(()=>({"aria-label":T(e.closeLabel),onClick(p){l.value=!1,a("click:close",p)}}));return()=>{const p=!!(n.prepend||t.value),u=!!(n.title||e.title),f=!!(n.close||e.closable);return l.value&&o(e.tag,{class:["v-alert",e.border&&{"v-alert--border":!!e.border,[`v-alert--border-${e.border===!0?"start":e.border}`]:!0},{"v-alert--prominent":e.prominent},g.value,b.value,h.value,y.value,k.value,B.value,i.value,e.class],style:[c.value,m.value,x.value,e.style],role:"alert"},{default:()=>{var v,V;return[_t(!1,"v-alert"),e.border&&o("div",{key:"border",class:["v-alert__border",w.value],style:C.value},null),p&&o("div",{key:"prepend",class:"v-alert__prepend"},[n.prepend?o(G,{key:"prepend-defaults",disabled:!t.value,defaults:{VIcon:{density:e.density,icon:t.value,size:e.prominent?44:28}}},n.prepend):o(Q,{key:"prepend-icon",density:e.density,icon:t.value,size:e.prominent?44:28},null)]),o("div",{class:"v-alert__content"},[u&&o(Ft,{key:"title"},{default:()=>{var S;return[((S=n.title)==null?void 0:S.call(n))??e.title]}}),((v=n.text)==null?void 0:v.call(n))??e.text,(V=n.default)==null?void 0:V.call(n)]),n.append&&o("div",{key:"append",class:"v-alert__append"},[n.append()]),f&&o("div",{key:"close",class:"v-alert__close"},[n.close?o(G,{key:"close-defaults",defaults:{VBtn:{icon:e.closeIcon,size:"x-small",variant:"text"}}},{default:()=>{var S;return[(S=n.close)==null?void 0:S.call(n,{props:I.value})]}}):o($e,q({key:"close-btn",icon:e.closeIcon,size:"x-small",variant:"text"},I.value),null)])]}})}}}),Kt={data:()=>({}),computed:{...kt(Ct)}};function Jt(e,s,a,n,l,t){return W(),pe(Ae,null,{default:_(()=>[Ye(o(qt,{type:e.alertMessageStore.them,icon:e.alertMessageStore.kind?"mdi-check-circle":"mdi-block-helper",text:e.alertMessageStore.message||"hola cris",variant:"tonal",title:e.alertMessageStore.kind?"Exito":"Error",border:"start",class:"custom-alert"},null,8,["type","icon","text","title"]),[[We,e.alertMessageStore.toggleAlert]])]),_:1})}const Gt=Me(Kt,[["render",Jt],["__scopeId","data-v-71fa380f"]]);const Qt=new Ke,ea={name:"ModalUserSettings",props:{expand:Boolean},methods:{async signOut(){await Qt.logout(),localStorage.clear(),this.$router.push("sign-in")}}},ta={class:"user-settings"};function aa(e,s,a,n,l,t){return W(),se("div",ta,[o(Ae,null,{default:_(()=>[Ye(o(Tt,{width:"250",class:"pa-5"},{default:_(()=>[o(Xe,null,{default:_(()=>[o(Fe,null,{default:_(()=>[Se("Opciones")]),_:1}),o(we,null,{prepend:_(()=>[o(Q,{icon:"mdi-exit-to-app"})]),default:_(()=>[o(Ve,null,{default:_(()=>[U("div",{onClick:s[0]||(s[0]=(...r)=>t.signOut&&t.signOut(...r)),textContent:"Cerrar sesión"})]),_:1})]),_:1}),o(we,null,{prepend:_(()=>[o(Q,{icon:"mdi-key-change"})]),default:_(()=>[o(Ve,null,{default:_(()=>[U("p",{onClick:s[1]||(s[1]=r=>e.$router.push("change-password")),style:{"white-space":"normal"},textContent:"Cambiar contraseña"})]),_:1})]),_:1})]),_:1})]),_:1},512),[[We,a.expand]])]),_:1})])}const la=Me(ea,[["render",aa],["__scopeId","data-v-9517b5a2"]]);const na=L({...X(),...Ge({fullHeight:!0}),...me()},"VApp"),oa=R()({name:"VApp",props:na(),setup(e,s){let{slots:a}=s;const n=fe(e),{layoutClasses:l,getLayoutItem:t,items:r,layoutRef:g}=tt(e),{rtlClasses:b}=Le();return z(()=>{var c;return o("div",{ref:g,class:["v-application",n.themeClasses.value,l.value,b.value,e.class],style:[e.style]},[o("div",{class:"v-application__wrap"},[(c=a.default)==null?void 0:c.call(a)])])}),{getLayoutItem:t,items:r,theme:n}}});const at=L({text:String,...X(),...ee()},"VToolbarTitle"),lt=R()({name:"VToolbarTitle",props:at(),setup(e,s){let{slots:a}=s;return z(()=>{const n=!!(a.default||a.text||e.text);return o(e.tag,{class:["v-toolbar-title",e.class],style:e.style},{default:()=>{var l;return[n&&o("div",{class:"v-toolbar-title__placeholder"},[a.text?a.text():e.text,(l=a.default)==null?void 0:l.call(a)])]}})}),{}}}),sa=[null,"prominent","default","comfortable","compact"],nt=L({absolute:Boolean,collapse:Boolean,color:String,density:{type:String,default:"default",validator:e=>sa.includes(e)},extended:Boolean,extensionHeight:{type:[Number,String],default:48},flat:Boolean,floating:Boolean,height:{type:[Number,String],default:64},image:String,title:String,...je(),...X(),...ke(),...Ce(),...ee({tag:"header"}),...me()},"VToolbar"),He=R()({name:"VToolbar",props:nt(),setup(e,s){var y;let{slots:a}=s;const{backgroundColorClasses:n,backgroundColorStyles:l}=xe(Z(e,"color")),{borderClasses:t}=Ze(e),{elevationClasses:r}=Be(e),{roundedClasses:g}=Ie(e),{themeClasses:b}=fe(e),{rtlClasses:c}=Le(),i=$(!!(e.extended||(y=a.extension)!=null&&y.call(a))),h=d(()=>parseInt(Number(e.height)+(e.density==="prominent"?Number(e.height):0)-(e.density==="comfortable"?8:0)-(e.density==="compact"?16:0),10)),m=d(()=>i.value?parseInt(Number(e.extensionHeight)+(e.density==="prominent"?Number(e.extensionHeight):0)-(e.density==="comfortable"?4:0)-(e.density==="compact"?8:0),10):0);return qe({VBtn:{variant:"text"}}),z(()=>{var w;const x=!!(e.title||a.title),k=!!(a.image||e.image),B=(w=a.extension)==null?void 0:w.call(a);return i.value=!!(e.extended||B),o(e.tag,{class:["v-toolbar",{"v-toolbar--absolute":e.absolute,"v-toolbar--collapse":e.collapse,"v-toolbar--flat":e.flat,"v-toolbar--floating":e.floating,[`v-toolbar--density-${e.density}`]:!0},n.value,t.value,r.value,g.value,b.value,c.value,e.class],style:[l.value,e.style]},{default:()=>[k&&o("div",{key:"image",class:"v-toolbar__image"},[a.image?o(G,{key:"image-defaults",disabled:!e.image,defaults:{VImg:{cover:!0,src:e.image}}},a.image):o(Bt,{key:"image-img",cover:!0,src:e.image},null)]),o(G,{defaults:{VTabs:{height:N(h.value)}}},{default:()=>{var C,T,I;return[o("div",{class:"v-toolbar__content",style:{height:N(h.value)}},[a.prepend&&o("div",{class:"v-toolbar__prepend"},[(C=a.prepend)==null?void 0:C.call(a)]),x&&o(lt,{key:"title",text:e.title},{text:a.title}),(T=a.default)==null?void 0:T.call(a),a.append&&o("div",{class:"v-toolbar__append"},[(I=a.append)==null?void 0:I.call(a)])])]}}),o(G,{defaults:{VTabs:{height:N(m.value)}}},{default:()=>[o(Ae,null,{default:()=>[i.value&&o("div",{class:"v-toolbar__extension",style:{height:N(m.value)}},[B])]})]})]})}),{contentHeight:h,extensionHeight:m}}}),ia=L({scrollTarget:{type:String},scrollThreshold:{type:[String,Number],default:300}},"scroll");function ua(e){let s=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{};const{canScroll:a}=s;let n=0;const l=ce(null),t=$(0),r=$(0),g=$(0),b=$(!1),c=$(!1),i=d(()=>Number(e.scrollThreshold)),h=d(()=>It((i.value-t.value)/i.value||0)),m=()=>{const y=l.value;!y||a&&!a.value||(n=t.value,t.value="window"in y?y.pageYOffset:y.scrollTop,c.value=t.value<n,g.value=Math.abs(t.value-i.value))};return H(c,()=>{r.value=r.value||t.value}),H(b,()=>{r.value=0}),ve(()=>{H(()=>e.scrollTarget,y=>{var k;const x=y?document.querySelector(y):window;x&&x!==l.value&&((k=l.value)==null||k.removeEventListener("scroll",m),l.value=x,l.value.addEventListener("scroll",m,{passive:!0}))},{immediate:!0})}),de(()=>{var y;(y=l.value)==null||y.removeEventListener("scroll",m)}),a&&H(a,m,{immediate:!0}),{scrollThreshold:i,currentScroll:t,currentThreshold:g,isScrollActive:b,scrollRatio:h,isScrollingUp:c,savedScroll:r}}const ra=L({scrollBehavior:String,modelValue:{type:Boolean,default:!0},location:{type:String,default:"top",validator:e=>["top","bottom"].includes(e)},...nt(),...Qe(),...ia(),height:{type:[Number,String],default:64}},"VAppBar"),ca=R()({name:"VAppBar",props:ra(),emits:{"update:modelValue":e=>!0},setup(e,s){let{slots:a}=s;const n=ce(),l=Te(e,"modelValue"),t=d(()=>{var C;const w=new Set(((C=e.scrollBehavior)==null?void 0:C.split(" "))??[]);return{hide:w.has("hide"),inverted:w.has("inverted"),collapse:w.has("collapse"),elevate:w.has("elevate"),fadeImage:w.has("fade-image")}}),r=d(()=>{const w=t.value;return w.hide||w.inverted||w.collapse||w.elevate||w.fadeImage||!l.value}),{currentScroll:g,scrollThreshold:b,isScrollingUp:c,scrollRatio:i}=ua(e,{canScroll:r}),h=d(()=>e.collapse||t.value.collapse&&(t.value.inverted?i.value>0:i.value===0)),m=d(()=>e.flat||t.value.elevate&&(t.value.inverted?g.value>0:g.value===0)),y=d(()=>t.value.fadeImage?t.value.inverted?1-i.value:i.value:void 0),x=d(()=>{var T,I;if(t.value.hide&&t.value.inverted)return 0;const w=((T=n.value)==null?void 0:T.contentHeight)??0,C=((I=n.value)==null?void 0:I.extensionHeight)??0;return w+C});ie(d(()=>!!e.scrollBehavior),()=>{$t(()=>{t.value.hide?t.value.inverted?l.value=g.value>b.value:l.value=c.value||g.value<b.value:l.value=!0})});const{ssrBootStyles:k}=Pe(),{layoutItemStyles:B}=et({id:e.name,order:d(()=>parseInt(e.order,10)),position:Z(e,"location"),layoutSize:x,elementSize:$(void 0),active:l,absolute:Z(e,"absolute")});return z(()=>{const w=He.filterProps(e);return o(He,q({ref:n,class:["v-app-bar",{"v-app-bar--bottom":e.location==="bottom"},e.class],style:[{...B.value,"--v-toolbar-image-opacity":y.value,height:void 0,...k.value},e.style]},w,{collapse:h.value,flat:m.value}),a)}),{}}}),va=L({...Mt({icon:"$menu",variant:"text"})},"VAppBarNavIcon"),da=R()({name:"VAppBarNavIcon",props:va(),setup(e,s){let{slots:a}=s;return z(()=>o($e,q(e,{class:["v-app-bar-nav-icon"]}),a)),{}}}),ma=R()({name:"VAppBarTitle",props:at(),setup(e,s){let{slots:a}=s;return z(()=>o(lt,q(e,{class:"v-app-bar-title"}),a)),{}}});const fa=L({...X(),...Ge()},"VLayout"),ga=R()({name:"VLayout",props:fa(),setup(e,s){let{slots:a}=s;const{layoutClasses:n,layoutStyles:l,getLayoutItem:t,items:r,layoutRef:g}=tt(e);return z(()=>{var b;return o("div",{ref:g,class:[n.value,e.class],style:[l.value,e.style]},[(b=a.default)==null?void 0:b.call(a)])}),{getLayoutItem:t,items:r}}});const ya=L({scrollable:Boolean,...X(),...ee({tag:"main"})},"VMain"),ha=R()({name:"VMain",props:ya(),setup(e,s){let{slots:a}=s;const{mainStyles:n}=Wt(),{ssrBootStyles:l}=Pe();return z(()=>o(e.tag,{class:["v-main",{"v-main--scrollable":e.scrollable},e.class],style:[n.value,l.value,e.style]},{default:()=>{var t,r;return[e.scrollable?o("div",{class:"v-main__scroller"},[(t=a.default)==null?void 0:t.call(a)]):(r=a.default)==null?void 0:r.call(a)]}})),{}}});function ba(e){let{rootEl:s,isSticky:a,layoutItemStyles:n}=e;const l=$(!1),t=$(0),r=d(()=>{const c=typeof l.value=="boolean"?"top":l.value;return[a.value?{top:"auto",bottom:"auto",height:void 0}:void 0,l.value?{[c]:N(t.value)}:{top:n.value.top}]});ve(()=>{H(a,c=>{c?window.addEventListener("scroll",b,{passive:!0}):window.removeEventListener("scroll",b)},{immediate:!0})}),de(()=>{window.removeEventListener("scroll",b)});let g=0;function b(){const c=g>window.scrollY?"up":"down",i=s.value.getBoundingClientRect(),h=parseFloat(n.value.top??0),m=window.scrollY-Math.max(0,t.value-h),y=i.height+Math.max(t.value,h)-window.scrollY-window.innerHeight,x=parseFloat(getComputedStyle(s.value).getPropertyValue("--v-body-scroll-y"))||0;i.height<window.innerHeight-h?(l.value="top",t.value=h):c==="up"&&l.value==="bottom"||c==="down"&&l.value==="top"?(t.value=window.scrollY+i.top-x,l.value=!0):c==="down"&&y<=0?(t.value=0,l.value="bottom"):c==="up"&&m<=0&&(x?l.value!=="top"&&(t.value=-m+x+h,l.value="top"):(t.value=i.top+m,l.value="top")),g=window.scrollY}return{isStuck:l,stickyStyles:r}}const pa=100,Sa=20;function ze(e){const s=1.41421356237;return(e<0?-1:1)*Math.sqrt(Math.abs(e))*s}function Oe(e){if(e.length<2)return 0;if(e.length===2)return e[1].t===e[0].t?0:(e[1].d-e[0].d)/(e[1].t-e[0].t);let s=0;for(let a=e.length-1;a>0;a--){if(e[a].t===e[a-1].t)continue;const n=ze(s),l=(e[a].d-e[a-1].d)/(e[a].t-e[a-1].t);s+=(l-n)*Math.abs(l),a===e.length-1&&(s*=.5)}return ze(s)*1e3}function wa(){const e={};function s(l){Array.from(l.changedTouches).forEach(t=>{(e[t.identifier]??(e[t.identifier]=new At(Sa))).push([l.timeStamp,t])})}function a(l){Array.from(l.changedTouches).forEach(t=>{delete e[t.identifier]})}function n(l){var c;const t=(c=e[l])==null?void 0:c.values().reverse();if(!t)throw new Error(`No samples for touch id ${l}`);const r=t[0],g=[],b=[];for(const i of t){if(r[0]-i[0]>pa)break;g.push({t:i[0],d:i[1].clientX}),b.push({t:i[0],d:i[1].clientY})}return{x:Oe(g),y:Oe(b),get direction(){const{x:i,y:h}=this,[m,y]=[Math.abs(i),Math.abs(h)];return m>y&&i>=0?"right":m>y&&i<=0?"left":y>m&&h>=0?"down":y>m&&h<=0?"up":Va()}}}return{addMovement:s,endTouch:a,getVelocity:n}}function Va(){throw new Error}function xa(e){let{isActive:s,isTemporary:a,width:n,touchless:l,position:t}=e;ve(()=>{window.addEventListener("touchstart",w,{passive:!0}),window.addEventListener("touchmove",C,{passive:!1}),window.addEventListener("touchend",T,{passive:!0})}),de(()=>{window.removeEventListener("touchstart",w),window.removeEventListener("touchmove",C),window.removeEventListener("touchend",T)});const r=d(()=>["left","right"].includes(t.value)),{addMovement:g,endTouch:b,getVelocity:c}=wa();let i=!1;const h=$(!1),m=$(0),y=$(0);let x;function k(p,u){return(t.value==="left"?p:t.value==="right"?document.documentElement.clientWidth-p:t.value==="top"?p:t.value==="bottom"?document.documentElement.clientHeight-p:j())-(u?n.value:0)}function B(p){let u=arguments.length>1&&arguments[1]!==void 0?arguments[1]:!0;const f=t.value==="left"?(p-y.value)/n.value:t.value==="right"?(document.documentElement.clientWidth-p-y.value)/n.value:t.value==="top"?(p-y.value)/n.value:t.value==="bottom"?(document.documentElement.clientHeight-p-y.value)/n.value:j();return u?Math.max(0,Math.min(1,f)):f}function w(p){if(l.value)return;const u=p.changedTouches[0].clientX,f=p.changedTouches[0].clientY,v=25,V=t.value==="left"?u<v:t.value==="right"?u>document.documentElement.clientWidth-v:t.value==="top"?f<v:t.value==="bottom"?f>document.documentElement.clientHeight-v:j(),S=s.value&&(t.value==="left"?u<n.value:t.value==="right"?u>document.documentElement.clientWidth-n.value:t.value==="top"?f<n.value:t.value==="bottom"?f>document.documentElement.clientHeight-n.value:j());(V||S||s.value&&a.value)&&(i=!0,x=[u,f],y.value=k(r.value?u:f,s.value),m.value=B(r.value?u:f),b(p),g(p))}function C(p){const u=p.changedTouches[0].clientX,f=p.changedTouches[0].clientY;if(i){if(!p.cancelable){i=!1;return}const V=Math.abs(u-x[0]),S=Math.abs(f-x[1]);(r.value?V>S&&V>3:S>V&&S>3)?(h.value=!0,i=!1):(r.value?S:V)>3&&(i=!1)}if(!h.value)return;p.preventDefault(),g(p);const v=B(r.value?u:f,!1);m.value=Math.max(0,Math.min(1,v)),v>1?y.value=k(r.value?u:f,!0):v<0&&(y.value=k(r.value?u:f,!1))}function T(p){if(i=!1,!h.value)return;g(p),h.value=!1;const u=c(p.changedTouches[0].identifier),f=Math.abs(u.x),v=Math.abs(u.y);(r.value?f>v&&f>400:v>f&&v>3)?s.value=u.direction===({left:"right",right:"left",top:"down",bottom:"up"}[t.value]||j()):s.value=m.value>.5}const I=d(()=>h.value?{transform:t.value==="left"?`translateX(calc(-100% + ${m.value*n.value}px))`:t.value==="right"?`translateX(calc(100% - ${m.value*n.value}px))`:t.value==="top"?`translateY(calc(-100% + ${m.value*n.value}px))`:t.value==="bottom"?`translateY(calc(100% - ${m.value*n.value}px))`:j(),transition:"none"}:void 0);return{isDragging:h,dragProgress:m,dragStyles:I}}function j(){throw new Error}const _a=["start","end","left","right","top","bottom"],ka=L({color:String,disableResizeWatcher:Boolean,disableRouteWatcher:Boolean,expandOnHover:Boolean,floating:Boolean,modelValue:{type:Boolean,default:null},permanent:Boolean,rail:{type:Boolean,default:null},railWidth:{type:[Number,String],default:56},scrim:{type:[Boolean,String],default:!0},image:String,temporary:Boolean,touchless:Boolean,width:{type:[Number,String],default:256},location:{type:String,default:"start",validator:e=>_a.includes(e)},sticky:Boolean,...je(),...X(),...Lt(),...ke(),...Qe(),...Ce(),...ee({tag:"nav"}),...me()},"VNavigationDrawer"),Ca=R()({name:"VNavigationDrawer",props:ka(),emits:{"update:modelValue":e=>!0,"update:rail":e=>!0},setup(e,s){let{attrs:a,emit:n,slots:l}=s;const{isRtl:t}=Le(),{themeClasses:r}=fe(e),{borderClasses:g}=Ze(e),{backgroundColorClasses:b,backgroundColorStyles:c}=xe(Z(e,"color")),{elevationClasses:i}=Be(e),{displayClasses:h,mobile:m}=Pt(e),{roundedClasses:y}=Ie(e),x=Et(),k=Te(e,"modelValue",null,M=>!!M),{ssrBootStyles:B}=Pe(),{scopeId:w}=Rt(),C=ce(),T=$(!1),I=d(()=>e.rail&&e.expandOnHover&&T.value?Number(e.width):Number(e.rail?e.railWidth:e.width)),p=d(()=>zt(e.location,t.value)),u=d(()=>!e.permanent&&(m.value||e.temporary)),f=d(()=>e.sticky&&!u.value&&p.value!=="bottom");ie(()=>e.expandOnHover&&e.rail!=null,()=>{H(T,M=>n("update:rail",!M))}),ie(()=>!e.disableResizeWatcher,()=>{H(u,M=>!e.permanent&&Ot(()=>k.value=!M))}),ie(()=>!e.disableRouteWatcher&&!!x,()=>{H(x.currentRoute,()=>u.value&&(k.value=!1))}),H(()=>e.permanent,M=>{M&&(k.value=!0)}),Nt(()=>{e.modelValue!=null||u.value||(k.value=e.permanent||!m.value)});const{isDragging:v,dragProgress:V,dragStyles:S}=xa({isActive:k,isTemporary:u,width:I,touchless:Z(e,"touchless"),position:p}),A=d(()=>{const M=u.value?0:e.rail&&e.expandOnHover?Number(e.railWidth):I.value;return v.value?M*V.value:M}),{layoutItemStyles:P,layoutItemScrimStyles:Y}=et({id:e.name,order:d(()=>parseInt(e.order,10)),position:p,layoutSize:A,elementSize:I,active:d(()=>k.value||v.value),disableTransitions:d(()=>v.value),absolute:d(()=>e.absolute||f.value&&typeof O.value!="string")}),{isStuck:O,stickyStyles:ge}=ba({rootEl:C,isSticky:f,layoutItemStyles:P}),ye=xe(d(()=>typeof e.scrim=="string"?e.scrim:null)),te=d(()=>({...v.value?{opacity:V.value*.2,transition:"none"}:void 0,...Y.value}));qe({VList:{bgColor:"transparent"}});function ae(){T.value=!0}function K(){T.value=!1}return z(()=>{const M=l.image||e.image;return o(ue,null,[o(e.tag,q({ref:C,onMouseenter:ae,onMouseleave:K,class:["v-navigation-drawer",`v-navigation-drawer--${p.value}`,{"v-navigation-drawer--expand-on-hover":e.expandOnHover,"v-navigation-drawer--floating":e.floating,"v-navigation-drawer--is-hovering":T.value,"v-navigation-drawer--rail":e.rail,"v-navigation-drawer--temporary":u.value,"v-navigation-drawer--active":k.value,"v-navigation-drawer--sticky":f.value},r.value,b.value,g.value,h.value,i.value,y.value,e.class],style:[c.value,P.value,S.value,B.value,ge.value,e.style]},w,a),{default:()=>{var le,D,F,ne;return[M&&o("div",{key:"image",class:"v-navigation-drawer__img"},[l.image?(le=l.image)==null?void 0:le.call(l,{image:e.image}):o("img",{src:e.image,alt:""},null)]),l.prepend&&o("div",{class:"v-navigation-drawer__prepend"},[(D=l.prepend)==null?void 0:D.call(l)]),o("div",{class:"v-navigation-drawer__content"},[(F=l.default)==null?void 0:F.call(l)]),l.append&&o("div",{class:"v-navigation-drawer__append"},[(ne=l.append)==null?void 0:ne.call(l)])]}}),o(Ht,{name:"fade-transition"},{default:()=>[u.value&&(v.value||k.value)&&!!e.scrim&&o("div",q({class:["v-navigation-drawer__scrim",ye.backgroundColorClasses.value],style:[te.value,ye.backgroundColorStyles.value],onClick:()=>k.value=!1},w),null)]})])}),{isStuck:O}}}),Ta=new Ke,Ba=new Dt,Ia={name:"AppBar",components:{ModalUserSettings:la,AlertMessage:Gt},data:()=>({user:{},toggleSettings:!1,drawer:!1,sections:[]}),async mounted(){await this.checkAuthUser(),await this.getFormsAvailable(),this.getUser()},methods:{async checkAuthUser(){const e=await Ta.user();e.statusResponse!=200&&this.$router.push("/sign-in"),this.user=e},async getFormsAvailable(){const e=await Ba.read("?format=routes-available");e.data&&(this.sections=e.data)},async getUser(){const e=localStorage.getItem("user");this.user=JSON.parse(e)}}},$a={class:"d-flex flex-column"},Ma={class:"d-block text-subtitle-1 text-right"},Aa={class:"d-block text-subtitle-2 text-grey-lighten-1 text-right"},La=["textContent"],Pa={class:"w-100 pa-16"};function Ea(e,s,a,n,l,t){const r=be("alert-message"),g=be("ModalUserSettings"),b=be("router-view");return W(),pe(oa,null,{default:_(()=>[o(ga,{class:""},{default:_(()=>[o(ca,null,{prepend:_(()=>[o(da,{variant:"text",onClick:s[1]||(s[1]=Ut(c=>e.drawer=!e.drawer,["stop"]))})]),default:_(()=>{var c,i;return[o(ma,null,{default:_(()=>[U("span",{onClick:s[0]||(s[0]=h=>e.$router.push("/"))},"STRATEO")]),_:1}),o(Yt),U("div",$a,[U("span",Ma,oe((c=this.user)==null?void 0:c.name),1),U("span",Aa,oe((i=this.user)==null?void 0:i.email),1)]),o($e,{icon:"",onClick:s[2]||(s[2]=()=>e.toggleSettings=!e.toggleSettings)},{default:_(()=>[o(Q,null,{default:_(()=>[Se("mdi-account-circle")]),_:1})]),_:1})]}),_:1}),o(Ca,{class:"pl-3",modelValue:e.drawer,"onUpdate:modelValue":s[3]||(s[3]=c=>e.drawer=c),location:"left",permanent:""},{default:_(()=>[(W(!0),se(ue,null,Re(e.sections,(c,i)=>(W(),se(ue,{key:`${i}-s-${i.id}`},[o(Fe,null,{default:_(()=>[Se(oe(i+1+". "+c.name),1)]),_:2},1024),o(Xe,{items:c.forms},{default:_(()=>[(W(!0),se(ue,null,Re(c.forms,(h,m)=>(W(),pe(we,{key:m,value:h,color:"primary",to:h.href},{prepend:_(()=>[o(Q,{icon:h.icon},null,8,["icon"])]),default:_(()=>[o(Ve,null,{default:_(()=>[U("div",{textContent:oe(h.name)},null,8,La)]),_:2},1024)]),_:2},1032,["value","to"]))),128))]),_:2},1032,["items"])],64))),128))]),_:1},8,["modelValue"]),o(ha,{class:"d-flex align-start justify-center",style:{"min-height":"100vh"}},{default:_(()=>{var c;return[o(r),o(g,{email:(c=e.user)==null?void 0:c.email,expand:e.toggleSettings},null,8,["email","expand"]),U("div",Pa,[o(b)])]}),_:1})]),_:1})]),_:1})}const Ha=Me(Ia,[["render",Ea]]);export{Ha as default};
