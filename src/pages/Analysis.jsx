import {useRef,useState} from 'react';import {UploadCloud,X,Loader2,Eye,EyeOff} from 'lucide-react';
import {imageApi} from '../services/api.js';import {useApp} from '../context/AppContext.jsx';import BoundingBoxOverlay from '../components/BoundingBoxOverlay.jsx';
const OK=['image/jpeg','image/png','image/webp'],MAX=10*1024*1024,TABS=['Description','People','Objects','Scene','Text'];
const kb=b=>b>1048576?(b/1048576).toFixed(1)+' MB':Math.round(b/1024)+' KB';
const Row=({k,v})=><div className="kv"><small>{k}</small><span>{v}</span></div>;
export default function Analysis(){
 const {current,setCurrent,notify,refresh}=useApp();const ref=useRef();
 const [drag,setDrag]=useState(false),[busy,setBusy]=useState(false),[tab,setTab]=useState('Description'),[show,setShow]=useState(true);
 const pick=f=>{if(!f)return;if(!OK.includes(f.type))return notify('Use a JPG, JPEG, PNG or WEBP image.','error');
  if(f.size>MAX)return notify('Image is larger than 10 MB.','error');setCurrent({file:f,url:URL.createObjectURL(f),name:f.name,size:f.size,analysis:null});};
 const analyze=async()=>{setBusy(true);try{const rec=await imageApi.upload(current.file);const analysis=await imageApi.analyze(rec.id);
  setCurrent({...current,id:rec.id,analysis});await refresh();notify('Analysis complete');}catch{notify('Analysis failed. Try again.','error');}setBusy(false);};
 const a=current?.analysis;
 return(<div className="split">
 <section className="card pane">
  {!current?<div className={`drop ${drag?'on':''}`} onDragOver={e=>{e.preventDefault();setDrag(true)}} onDragLeave={()=>setDrag(false)} onDrop={e=>{e.preventDefault();setDrag(false);pick(e.dataTransfer.files[0])}}>
   <UploadCloud size={40}/><h3>Drag and drop an image</h3><p>JPG, JPEG, PNG or WEBP, up to 10 MB</p>
   <button className="btn" onClick={()=>ref.current.click()}>Browse Files</button>
   <input ref={ref} hidden type="file" accept=".jpg,.jpeg,.png,.webp" onChange={e=>{pick(e.target.files[0]);e.target.value=''}}/></div>
  :<>
   <div className="row between"><div><b>{current.name}</b><br/><small>{kb(current.size)}</small></div>
    <div className="row gap">{a&&<button className="btn sm ghost" onClick={()=>setShow(!show)}>{show?<EyeOff size={14}/>:<Eye size={14}/>}{show?'Hide':'Show'} detected objects</button>}
    <button className="btn sm ghost" onClick={()=>setCurrent(null)} disabled={busy}><X size={14}/>Remove</button></div></div>
   <div className={busy?'scanning':''}><BoundingBoxOverlay src={current.url} objects={a?.objects||[]} show={show&&!!a}/></div>
   {!a&&<button className="btn lg full" onClick={analyze} disabled={busy}>{busy?<><Loader2 className="spin" size={16}/>Analyzing image…</>:'Analyze Image'}</button>}</>}
 </section>
 <section className="card pane">
  {!a?<div className="empty inner"><h3>{busy?'Reading your image…':'No analysis yet'}</h3><p>{busy?'Detecting people, objects, scene and text.':'Upload an image and select Analyze Image to see insights here.'}</p>{busy&&<div className="skel-lines"><i/><i/><i/><i/></div>}</div>:<>
   <div className="tabs">{TABS.map(t=><button key={t} className={t===tab?'on':''} onClick={()=>setTab(t)}>{t}</button>)}</div>
   {tab==='Description'&&<><p className="lead">{a.description.summary}</p><Row k="Main scene" v={a.description.scene}/><Row k="Environment" v={a.description.environment}/><Row k="Lighting" v={a.description.lighting}/><Row k="Image quality" v={a.description.quality}/></>}
   {tab==='People'&&<><p className="lead">{a.people.length} people visible</p>{a.people.map(p=><div key={p.id} className="card inset"><b>Person {p.id}</b><Row k="Position" v={p.position}/><Row k="Apparent age" v={p.age}/><Row k="Clothing" v={p.clothing}/><Row k="Activity" v={p.activity}/></div>)}</>}
   {tab==='Objects'&&<div className="table-wrap"><table><thead><tr><th>Object</th><th>Category</th><th>Count</th><th>Confidence</th><th>Box (x,y,w,h %)</th></tr></thead>
    <tbody>{a.objects.map((o,i)=><tr key={i}><td>{o.name}</td><td>{o.category}</td><td>{o.count}</td><td>{Math.round(o.confidence*100)}%</td><td>{o.box.join(', ')}</td></tr>)}</tbody></table></div>}
   {tab==='Scene'&&<><Row k="Setting" v={a.scene.setting}/><Row k="Scene type" v={a.scene.type}/><Row k="Weather" v={a.scene.weather}/><Row k="Lighting" v={a.scene.lighting}/></>}
   {tab==='Text'&&<div className="card inset">{a.text.map((t,i)=><p key={i} className="ocr">{t}</p>)}</div>}</>}
 </section></div>);}
