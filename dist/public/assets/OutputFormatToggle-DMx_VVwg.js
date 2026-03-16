import{c as o,j as r,ae as s,af as l,ag as c,r as u}from"./index-DHRBtPG_.js";import{F as d}from"./file-text-CDZHgZyK.js";/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const p=o("Code",[["polyline",{points:"16 18 22 12 16 6",key:"z7tu5w"}],["polyline",{points:"8 6 2 12 8 18",key:"1eg1df"}]]);/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const g=o("Type",[["polyline",{points:"4 7 4 4 20 4 20 7",key:"1nosan"}],["line",{x1:"9",x2:"15",y1:"20",y2:"20",key:"swin9y"}],["line",{x1:"12",x2:"12",y1:"4",y2:"20",key:"1tx1rr"}]]),m=[{key:"rich",label:"Rich Text",icon:d,desc:"Formatted with headings, bold, and structure"},{key:"plain",label:"Plain Text",icon:g,desc:"Raw text without formatting — paste anywhere"},{key:"machine",label:"Machine",icon:p,desc:"Structured JSON for automation and APIs"}];function h({value:t,onChange:n}){return r.jsx("div",{className:"flex items-center gap-1 rounded-lg border border-border/40 bg-muted/20 p-0.5","data-testid":"output-format-toggle",children:m.map(e=>{const a=e.icon,i=t===e.key;return r.jsxs(s,{children:[r.jsx(l,{asChild:!0,children:r.jsxs("button",{onClick:()=>n(e.key),className:`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs transition-all duration-150 ${i?"bg-background text-foreground shadow-sm":"text-muted-foreground hover:text-foreground hover:bg-background/50"}`,"data-testid":`button-format-${e.key}`,children:[r.jsx(a,{className:"w-3 h-3"}),r.jsx("span",{children:e.label})]})}),r.jsx(c,{side:"bottom",children:e.desc})]},e.key)})})}function f(t,n,e){return n==="machine"?JSON.stringify(e||{content:t,generatedAt:new Date().toISOString()},null,2):n==="plain"?t.replace(/#{1,6}\s/g,"").replace(/\*\*(.*?)\*\*/g,"$1").replace(/\*(.*?)\*/g,"$1").replace(/`(.*?)`/g,"$1").replace(/---/g,"").replace(/\n{3,}/g,`

`):t}function b(t="rich"){const[n,e]=u.useState(t);return{outputFormat:n,setOutputFormat:e}}export{h as O,f,b as u};
