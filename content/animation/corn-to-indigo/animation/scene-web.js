/* 웹용: 바탕을 사이트 히어로의 아이보리(#f6f3ec)로 바꾼 것 외에는 고객 제공 scene.js 와 같다(2026-10-06) */
(() => {
  const W=1920,H=1080,D=22,FPS=30;
  const ink='#101f4b',muted='#687485',bond='#424955',gold='#d7a437';
  const c=document.querySelector('canvas');
  const ctx=c.getContext('2d',{alpha:false});
  const ease=t=>{t=Math.max(0,Math.min(1,t));return t*t*(3-2*t)};
  const clamp=t=>Math.max(0,Math.min(1,t));
  const lerp=(a,b,t)=>a+(b-a)*t;
  const pts=[[172,365],[318,290],[460,365],[460,523],[320,598],[172,525],[625,321],[740,448],[942,447],[1053,572],[1216,365],[1361,291],[1508,365],[1508,525],[1362,599],[1216,524],[625,566],[1054,310],[650,164],[1050,697]];
  const edgeSpec=[[0,1,2],[1,2,1],[2,3,2],[3,4,1],[4,5,2],[5,0,1],[2,6,1],[6,7,1],[7,16,1],[16,3,1],[7,8,2],[8,17,1],[17,10,1],[10,15,2],[15,9,1],[9,8,1],[10,11,1],[11,12,2],[12,13,1],[13,14,2],[14,15,1],[6,18,2],[9,19,2]];
  const launch=Array.from({length:16},(_,i)=>2.4+i*.62);
  const land=launch.map(t=>t+1.36);
  const appear=[...land,land[7]+.18,land[10]+.14,land[6]+.2,land[9]+.2];
  const sources=[[569,262],[626,303],[518,309],[576,349],[634,390],[516,400],[577,440],[627,480],[499,493],[554,533],[611,575],[667,536],[488,591],[543,631],[602,673],[653,714]];
  let corn,ref,kernel;
  function txt(s,x,y,size=25,color=ink,weight=400,align='left'){
    ctx.fillStyle=color;ctx.font=`${weight} ${size}px "Segoe UI","Malgun Gothic",Arial,sans-serif`;
    ctx.textAlign=align;ctx.textBaseline='middle';ctx.fillText(s,x,y);
  }
  function withAlpha(a,fn){ctx.save();ctx.globalAlpha*=clamp(a);fn();ctx.restore()}
  function roundRect(x,y,w,h,r,fill,stroke){ctx.beginPath();ctx.roundRect(x,y,w,h,r);if(fill){ctx.fillStyle=fill;ctx.fill()}if(stroke){ctx.strokeStyle=stroke;ctx.stroke()}}
  function stage(t){return t<2.4?0:t<15?1:2}
  function transform(t){const q=ease((t-14.8)/1.5);return {s:lerp(.79,1.0,q),x:lerp(1220,960,q),y:lerp(550,568,q),q}}
  function target(i,t){const a=transform(t);return [(pts[i][0]-840)*a.s+a.x,(pts[i][1]-445)*a.s+a.y]}
  function cornBox(t){let q=ease((t-.45)/1.4);return {x:lerp(110,68,q),y:lerp(248,242,q),w:lerp(453,433,q),h:lerp(680,650,q)}}
  function source(i,t){let a=cornBox(t);return [a.x+sources[i][0]/1024*a.w,a.y+sources[i][1]/1536*a.h]}
  function pathPoint(i,u,t){const [ax,ay]=source(i,t),[bx,by]=target(i,t);const e=ease(u),arc=110+35*(i%3);const px=lerp(ax,bx,e),py=lerp(ay,by,e)-Math.sin(Math.PI*e)*arc;return [px,py]}
  function drawKernel(x,y,w,angle=0,alpha=1){ctx.save();ctx.globalAlpha*=alpha;ctx.translate(x,y);ctx.rotate(angle);ctx.drawImage(kernel,-w/2,-w*.55,w,w*1.1);ctx.restore()}
  function line(x1,y1,x2,y2,width,color){ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.strokeStyle=color;ctx.lineWidth=width;ctx.lineCap='round';ctx.stroke()}
  function nodeRadius(i,s){return (i<16?48:i<18?30:30)*s}
  function drawBonds(t){const a=transform(t);for(const [i,j,n] of edgeSpec){let birth=Math.max(appear[i],appear[j])+.05;let p=ease((t-birth)/.36);if(p<=0)continue;let [x1,y1]=target(i,t),[x2,y2]=target(j,t),dx=x2-x1,dy=y2-y1,len=Math.hypot(dx,dy),ux=dx/len,uy=dy/len;let r1=nodeRadius(i,a.s),r2=nodeRadius(j,a.s);x1+=ux*r1;y1+=uy*r1;x2-=ux*r2;y2-=uy*r2;const mx=(x1+x2)/2,my=(y1+y2)/2;const ends=[lerp(mx,x1,p),lerp(my,y1,p),lerp(mx,x2,p),lerp(my,y2,p)];const off=n===2?6.1*a.s:0;for(const sign of n===2?[-1,1]:[0]){line(ends[0]-uy*off*sign,ends[1]+ux*off*sign,ends[2]-uy*off*sign,ends[3]+ux*off*sign,4.3*a.s,bond)}}}
  function dockingRing(i,t){let d=t-land[i];if(d<0||d>.5)return;const [x,y]=target(i,t),s=transform(t).s;ctx.save();ctx.globalAlpha=.26*(1-d/.5);ctx.strokeStyle=gold;ctx.lineWidth=2;ctx.beginPath();ctx.arc(x,y,(47+18*d/.5)*s,0,Math.PI*2);ctx.stroke();ctx.restore()}
  function drawCarbon(i,t){if(t<launch[i])return;let d=t-launch[i],s=transform(t).s;if(d<1.36){let u=clamp(d/1.36);let [x,y]=pathPoint(i,u,t);let w=lerp(25,92*s,ease(u));let rot=Math.sin(Math.PI*u)*(.25*(i%2?1:-1));if(u>.05&&u<.86){ctx.save();ctx.strokeStyle='rgba(207,173,94,.15)';ctx.lineWidth=1.4;ctx.beginPath();for(let z=Math.max(0,u-.11);z<=u;z+=.012){let [px,py]=pathPoint(i,z,t);if(z===Math.max(0,u-.11))ctx.moveTo(px,py);else ctx.lineTo(px,py)}ctx.stroke();ctx.restore()}
      drawKernel(x,y,w,rot,ease(u/.09));
    }else{let [x,y]=target(i,t),dt=t-land[i];let wob=dt<.42?1+.075*Math.sin(dt/.42*Math.PI*2)*Math.exp(-dt*7):1;drawKernel(x,y,92*s*wob);dockingRing(i,t)}}
  function drawHetero(t){let s=transform(t).s;for(let i=16;i<20;i++){let a=ease((t-appear[i])/.44);if(!a)continue;let [x,y]=target(i,t);withAlpha(a,()=>{let yy=y+(1-a)*(i%2?-16:16);txt(i<18?'N':'O',x,yy,69*s,i<18?'#103786':'#c92431',500,'center');if(i<18)txt('H',x,yy+(i===16?71:-69)*s,65*s,'#7b7d83',400,'center')})}}
  function drawGuides(t){let opacity=.15*ease((t-1.65)/.6)*(1-ease((t-12.8)/.6));if(opacity<=0)return;const s=transform(t).s;ctx.save();ctx.globalAlpha=opacity;ctx.strokeStyle='#b7c0cc';ctx.setLineDash([3,7]);ctx.lineWidth=1;for(let i=0;i<16;i++)if(t<launch[i]){let [x,y]=target(i,t);ctx.beginPath();ctx.arc(x,y,26*s,0,Math.PI*2);ctx.stroke()}ctx.restore()}
  function drawCorn(t){let fade=1-ease((t-14.5)/1.1);if(fade<=0)return;let a=cornBox(t);withAlpha(fade*ease(t/.7),()=>{ctx.save();ctx.translate(0,6*Math.sin(Math.min(t,2)*Math.PI/4));ctx.drawImage(corn,a.x,a.y,a.w,a.h);ctx.restore();for(let i=0;i<16;i++){if(t<launch[i])continue;let age=t-launch[i],op=ease(age/.1)*.8;let [sx,sy]=source(i,t);withAlpha(op,()=>{const g=ctx.createRadialGradient(sx-3,sy-3,1,sx,sy,11);g.addColorStop(0,'#9b681a');g.addColorStop(.65,'#bf8c34');g.addColorStop(1,'#e9b752');roundRect(sx-10,sy-7,20,14,6,g);ctx.strokeStyle='rgba(253,221,133,.6)';ctx.lineWidth=.8;ctx.beginPath();ctx.moveTo(sx-6,sy+6);ctx.lineTo(sx+5,sy+6);ctx.stroke()})}
    txt('옥수수 · 식물유래 탄소',294,910,24,ink,600,'center');
    txt('Maize · plant-derived carbon',294,945,18,muted,400,'center');
  })}
  function drawTop(t){ctx.fillStyle=ink;ctx.fillRect(83,70,5,24);txt('BLUGENE',104,82,23,ink,700);txt('분자구조 개념 애니메이션',1838,82,21,muted,400,'right');
    txt('식물유래 탄소와 인디고 분자구조',82,145,43,ink,600);
    txt('Plant-derived carbon in the indigo molecular structure',83,197,24,muted,400);
    line(84,233,1838,233,1,'#e8ebef');
    let st=stage(t);const label=st===0?'01   식물유래 탄소':st===1?'02   탄소 골격의 조립':'03   인디고 구조 완성';
    txt(label,1838,196,22,ink,600,'right');
  }
  function drawLegend(t){withAlpha(ease((t-1.6)/.6),()=>{drawKernel(1580,288,28);txt('C = 식물유래 탄소',1610,288,21,muted);})}
  function drawLower(t){let st=stage(t),n=land.filter(x=>t>=x).length;
    if(st===1){withAlpha(ease((t-2.3)/.45)*(1-ease((t-14)/.6)),()=>{txt('탄소 위치',1738,819,19,muted,400,'right');txt(`${String(n).padStart(2,'0')} / 16`,1738,861,34,ink,600,'right')})}
    withAlpha(ease((t-15.7)/.6),()=>{txt('인디고',960,898,32,ink,600,'center');txt('C₁₆H₁₀N₂O₂',960,942,32,ink,400,'center')});
    line(84,983,1838,983,1,'#e4e8ec');
    txt('개념 시각화: 옥수수 알갱이는 탄소의 기원을 상징하며, 실제 생합성 경로를 나타내지 않습니다.',960,1019,18,muted,400,'center');
    txt('Conceptual illustration of carbon origin; not a biosynthetic reaction sequence.',960,1048,16,'#8b949f',400,'center');
  }
  function draw(t,scale=2){c.width=W*scale;c.height=H*scale;ctx.setTransform(scale,0,0,scale,0,0);ctx.fillStyle='#f6f3ec';ctx.fillRect(0,0,W,H);drawTop(t);drawCorn(t);drawGuides(t);drawBonds(t);drawHetero(t);for(let i=0;i<16;i++)drawCarbon(i,t);drawLegend(t);drawLower(t);return c;}
  async function init(){[corn,ref]=await Promise.all(['../image_inputs/corn.png','../image_inputs/refined.jpg'].map(src=>new Promise((resolve,reject)=>{let im=new Image();im.onload=()=>resolve(im);im.onerror=reject;im.src=src})));kernel=document.createElement('canvas');kernel.width=100;kernel.height=110;const k=kernel.getContext('2d');k.drawImage(ref,268,235,100,110,0,0,100,110);let dat=k.getImageData(0,0,100,110),d=dat.data,seen=new Uint8Array(11000),q=[];for(let x=0;x<100;x++){q.push(x,10900+x)}for(let y=0;y<110;y++){q.push(y*100,y*100+99)}while(q.length){let i=q.pop();if(i<0||i>=11000||seen[i])continue;seen[i]=1;let j=i*4,r=d[j],g=d[j+1],b=d[j+2];if(Math.min(r,g,b)<190||Math.max(r,g,b)-Math.min(r,g,b)>27)continue;d[j+3]=0;let x=i%100;if(x>0)q.push(i-1);if(x<99)q.push(i+1);if(i>=100)q.push(i-100);if(i<10900)q.push(i+100)}let marked=new Uint8Array(11000),largest=[];for(let a=0;a<11000;a++){if(marked[a]||!d[a*4+3])continue;let stack=[a],comp=[];marked[a]=1;while(stack.length){let z=stack.pop();comp.push(z);let x=z%100;for(let nb of [x>0?z-1:-1,x<99?z+1:-1,z-100,z+100])if(nb>=0&&nb<11000&&!marked[nb]&&d[nb*4+3]){marked[nb]=1;stack.push(nb)}}if(comp.length>largest.length)largest=comp}let keep=new Uint8Array(11000);for(let i of largest)keep[i]=1;for(let i=0;i<11000;i++)if(!keep[i])d[i*4+3]=0;k.putImageData(dat,0,0);draw(0);return true}
  window.scene={init,draw,duration:D,fps:FPS,pts,edgeSpec,launch,land,appear};
})();
