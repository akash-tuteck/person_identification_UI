import {Link} from 'react-router-dom';import {ImageIcon} from 'lucide-react';
export const fmtDate=d=>new Date(d).toLocaleDateString(undefined,{day:'numeric',month:'short',year:'numeric'});
export const StatCard=({icon:Icon,label,value,tone})=><div className="card stat"><span className={`stat-ic ${tone}`}><Icon size={20}/></span><div><small>{label}</small><b>{value}</b></div></div>;
export const Badge=({status})=><span className={`badge ${status.toLowerCase()}`}>{status}</span>;
export const Thumb=({img})=>img.url?<img className="thumb" src={img.url} alt={img.name}/>:<div className="thumb ph" style={{background:`linear-gradient(135deg,hsl(${img.hue} 80% 92%),hsl(${img.hue+40} 75% 82%))`}}><ImageIcon size={28}/></div>;
export const Empty=({title,text,to,cta})=><div className="card empty"><ImageIcon size={36}/><h3>{title}</h3><p>{text}</p>{to&&<Link className="btn" to={to}>{cta}</Link>}</div>;
export const Skeleton=({n=4})=><div className="grid">{Array.from({length:n},(_,i)=><div key={i} className="card skel"/>)}</div>;
export function ConfirmDialog({open,title,text,onConfirm,onCancel}){if(!open)return null;
 return <div className="modal-bg" onClick={onCancel}><div className="card modal" role="dialog" onClick={e=>e.stopPropagation()}><h3>{title}</h3><p>{text}</p>
 <div className="row end"><button className="btn ghost" onClick={onCancel}>Cancel</button><button className="btn danger" onClick={onConfirm}>Delete</button></div></div></div>;}
export function ImageCard({img,onView,onDelete,list}){return <div className={`card img-card ${list?'list':''}`}><Thumb img={img}/>
 <div className="img-body"><b className="trunc">{img.name}</b><small>{fmtDate(img.uploadedAt)}</small>
 <div className="row gap"><small>{img.people} people</small><small>{img.objects} objects</small><Badge status={img.status}/></div>
 <div className="row gap"><button className="btn sm" onClick={onView}>View analysis</button>{onDelete&&<button className="btn sm ghost" onClick={onDelete}>Delete</button>}</div></div></div>;}
