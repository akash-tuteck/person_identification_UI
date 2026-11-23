import {useState,useMemo} from 'react';import {useNavigate} from 'react-router-dom';import {LayoutGrid,List} from 'lucide-react';
import {useApp} from '../context/AppContext.jsx';import {ImageCard,ConfirmDialog,Empty,Skeleton} from '../components/ui.jsx';
const PER=6;
export default function History(){const {images,loading,remove}=useApp(),nav=useNavigate();
 const [q,setQ]=useState(''),[st,setSt]=useState('All'),[cat,setCat]=useState('All'),[days,setDays]=useState(0),[list,setList]=useState(false),[page,setPage]=useState(1),[del,setDel]=useState(null);
 const rows=useMemo(()=>images.filter(i=>i.name.toLowerCase().includes(q.toLowerCase())&&(st==='All'||i.status===st)&&(cat==='All'||i.categories.includes(cat))&&(!days||Date.now()-new Date(i.uploadedAt)<days*864e5)),[images,q,st,cat,days]);
 const pages=Math.max(1,Math.ceil(rows.length/PER)),cur=Math.min(page,pages),shown=rows.slice((cur-1)*PER,cur*PER);const reset=fn=>v=>{fn(v);setPage(1)};
 return(<>
 <div className="card toolbar"><input className="input" placeholder="Search by filename" value={q} onChange={e=>reset(setQ)(e.target.value)}/>
  <select className="input" value={days} onChange={e=>reset(setDays)(+e.target.value)}><option value={0}>Any date</option><option value={7}>Last 7 days</option><option value={30}>Last 30 days</option></select>
  <select className="input" value={st} onChange={e=>reset(setSt)(e.target.value)}>{['All','Completed','Processing','Failed'].map(s=><option key={s}>{s}</option>)}</select>
  <select className="input" value={cat} onChange={e=>reset(setCat)(e.target.value)}>{['All','People','Vehicles','Furniture','Electronics','Animals'].map(s=><option key={s}>{s}</option>)}</select>
  <div className="seg"><button className={!list?'on':''} onClick={()=>setList(false)} aria-label="Grid view"><LayoutGrid size={16}/></button><button className={list?'on':''} onClick={()=>setList(true)} aria-label="List view"><List size={16}/></button></div></div>
 {loading?<Skeleton/>:!shown.length?<Empty title="No images found" text="Try changing your search or filters."/>:
 <div className={list?'stack':'grid'}>{shown.map(i=><ImageCard key={i.id} img={i} list={list} onView={()=>nav('/analysis')} onDelete={()=>setDel(i)}/>)}</div>}
 <div className="row center gap pager"><button className="btn sm ghost" disabled={cur===1} onClick={()=>setPage(cur-1)}>Previous</button><small>Page {cur} of {pages}</small><button className="btn sm ghost" disabled={cur===pages} onClick={()=>setPage(cur+1)}>Next</button></div>
 <ConfirmDialog open={!!del} title="Delete this image?" text={`${del?.name} and its analysis will be removed. This can't be undone.`} onCancel={()=>setDel(null)} onConfirm={async()=>{await remove(del.id);setDel(null)}}/>
 </>);}
