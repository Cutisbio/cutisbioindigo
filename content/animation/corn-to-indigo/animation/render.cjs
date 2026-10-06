const fs=require('fs'),path=require('path');
const {chromium}=require('C:/Users/wonwo/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const root=path.resolve(__dirname,'..'),out=path.join(root,'outputs');fs.mkdirSync(out,{recursive:true});
const u32=n=>{let b=Buffer.alloc(4);b.writeUInt32BE(n>>>0);return b};
const u16=n=>{let b=Buffer.alloc(2);b.writeUInt16BE(n);return b};
const zeros=n=>Buffer.alloc(n),str=s=>Buffer.from(s,'ascii');
const box=(t,...xs)=>{const b=Buffer.concat(xs);return Buffer.concat([u32(b.length+8),str(t),b])};
const full=(t,v,f,...xs)=>box(t,Buffer.from([v,(f>>>16)&255,(f>>>8)&255,f&255]),...xs);
const matrix=()=>Buffer.concat([u32(0x10000),u32(0),u32(0),u32(0),u32(0x10000),u32(0),u32(0),u32(0),u32(0x40000000)]);
function mp4(samples,config,w,h,fps,file){
  const timescale=30000,delta=timescale/fps,duration=samples.length*delta;
  const ftyp=box('ftyp',str('isom'),u32(0x200),str('isomiso2avc1mp41'));
  const data=Buffer.concat(samples.map(x=>x.data)),mdat=box('mdat',data),offset=ftyp.length+8;
  const mvhd=full('mvhd',0,0,u32(0),u32(0),u32(timescale),u32(duration),u32(0x10000),u16(0x100),zeros(10),matrix(),zeros(24),u32(2));
  const tkhd=full('tkhd',0,7,u32(0),u32(0),u32(1),u32(0),u32(duration),zeros(8),u16(0),u16(0),u16(0),u16(0),matrix(),u32(w*65536),u32(h*65536));
  const mdhd=full('mdhd',0,0,u32(0),u32(0),u32(timescale),u32(duration),u16(0x55c4),u16(0));
  const hdlr=full('hdlr',0,0,u32(0),str('vide'),zeros(12),str('Blugene Scientific Animation\0'));
  const avc1=box('avc1',zeros(6),u16(1),zeros(16),u16(w),u16(h),u32(0x480000),u32(0x480000),u32(0),u16(1),zeros(32),u16(0x18),u16(0xffff),box('avcC',config),box('colr',str('nclx'),u16(1),u16(1),u16(1),Buffer.from([0])));
  const stsd=full('stsd',0,0,u32(1),avc1);
  const stts=full('stts',0,0,u32(1),u32(samples.length),u32(delta));
  const stsc=full('stsc',0,0,u32(1),u32(1),u32(samples.length),u32(1));
  const stsz=full('stsz',0,0,u32(0),u32(samples.length),...samples.map(s=>u32(s.data.length)));
  const stco=full('stco',0,0,u32(1),u32(offset));
  const keys=samples.map((s,i)=>s.key?i+1:0).filter(Boolean);
  const stss=full('stss',0,0,u32(keys.length),...keys.map(u32));
  const stbl=box('stbl',stsd,stts,stsc,stsz,stco,stss);
  const dinf=box('dinf',full('dref',0,0,u32(1),full('url ',0,1)));
  const minf=box('minf',full('vmhd',0,1,u16(0),zeros(6)),dinf,stbl);
  const trak=box('trak',tkhd,box('mdia',mdhd,hdlr,minf));
  const moov=box('moov',mvhd,trak);
  fs.writeFileSync(file,Buffer.concat([ftyp,mdat,moov]));return {frames:samples.length,duration:duration/timescale,bytes:fs.statSync(file).size,width:w,height:h,codec:'H.264/AVC',fps};
}
(async()=>{
 const preview=process.argv.includes('--preview');
 const scale=process.argv.includes('--1080')?1:2;
 const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',args:['--allow-file-access-from-files']});
 const page=await browser.newPage({viewport:{width:1920,height:1080}});
 page.on('console',m=>console.log(m.text()));
 await page.goto('file:///'+path.join(__dirname,'index.html').replace(/\\/g,'/'));await page.evaluate(()=>window.scene.init());
 for(const t of [1.6,5.9,10.8,13.4,18]){const data=await page.evaluate(({t})=>{window.scene.draw(t,1);return document.querySelector('canvas').toDataURL('image/png')},{t});fs.writeFileSync(path.join(out,`preview_${String(t).replace('.','_')}.png`),Buffer.from(data.split(',')[1],'base64'))}
 if(preview){console.log('PREVIEWS_READY');await browser.close();return}
 let samples=[],config=null;
 await page.exposeFunction('receiveChunk',(b64,key,ts,description)=>{samples.push({data:Buffer.from(b64,'base64'),key,ts});if(description)config=Buffer.from(description,'base64')});
 await page.evaluate(async({scale})=>{
  const scene=window.scene,canvas=document.querySelector('canvas'),fps=scene.fps,duration=scene.duration;let pending=[],error=null;
  const toBase64=arr=>{let s='';for(let i=0;i<arr.length;i+=32768)s+=String.fromCharCode(...arr.subarray(i,i+32768));return btoa(s)};
  const encoder=new VideoEncoder({output:(chunk,meta)=>{let d=new Uint8Array(chunk.byteLength);chunk.copyTo(d);pending.push(window.receiveChunk(toBase64(d),chunk.type==='key',chunk.timestamp,meta.decoderConfig?.description?toBase64(new Uint8Array(meta.decoderConfig.description)):null))},error:e=>{error=e.message}});
  encoder.configure({codec:'avc1.640033',width:1920*scale,height:1080*scale,bitrate:scale===2?24000000:10000000,framerate:fps,latencyMode:'realtime',hardwareAcceleration:'prefer-software',avc:{format:'avc'}});
  for(let n=0;n<duration*fps;n++){if(error)throw new Error(error);while(encoder.encodeQueueSize>8)await new Promise(r=>setTimeout(r,3));scene.draw(n/fps,scale);let frame=new VideoFrame(canvas,{timestamp:Math.round(n*1e6/fps),duration:Math.round((n+1)*1e6/fps)-Math.round(n*1e6/fps)});encoder.encode(frame,{keyFrame:n%(fps*2)===0});frame.close();if(n%90===0)console.log(`ENCODE ${n}/${duration*fps}`)}
  await encoder.flush();await Promise.all(pending);encoder.close();if(error)throw new Error(error);
 },{scale});
 samples.sort((a,b)=>a.ts-b.ts);if(!config)throw new Error('Encoder did not provide AVC config');
 const file=path.join(out,scale===2?'Blugene_Corn_to_Indigo_4K.mp4':'Blugene_Corn_to_Indigo_1080p.mp4');
 const report=mp4(samples,config,1920*scale,1080*scale,30,file);
 fs.writeFileSync(path.join(out,`render_${scale}.json`),JSON.stringify(report,null,2));console.log('RENDER_DONE '+JSON.stringify(report));
 await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
