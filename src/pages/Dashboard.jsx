import {useNavigate} from 'react-router-dom';import {Images,Users,Boxes,CheckCircle2} from 'lucide-react';
import {useApp} from '../context/AppContext.jsx';import {StatCard,ImageCard,Skeleton,fmtDate} from '../components/ui.jsx';
export default function Dashboard(){const {images,loading}=useApp(),nav=useNavigate();
 const sum=k=>images.reduce((n,i)=>n+i[k],0);
 return(<>
 <section className="card hero"><div><h2>Welcome to DocuMind AI</h2><p>Turn your images into meaningful insights with artificial intelligence.</p></div>
  <button className="btn lg" onClick={()=>nav('/analysis')}>Analyze New Image</button></section>
 <div className="grid stats"><StatCard icon={Images} label="Total Images Analyzed" value={images.length} tone="p"/><StatCard icon={Users} label="People Detected" value={sum('people')} tone="b"/>
  <StatCard icon={Boxes} label="Objects Detected" value={sum('objects')} tone="p"/><StatCard icon={CheckCircle2} label="Analyses Completed" value={images.filter(i=>i.status==='Completed').length} tone="b"/></div>
 <h3 className="section">Recent image analyses</h3>
 {loading?<Skeleton/>:<div className="grid">{images.slice(0,4).map(i=><ImageCard key={i.id} img={i} onView={()=>nav('/history')}/>)}</div>}
 <h3 className="section">Recent activity</h3>
 <div className="card"><ul className="activity">{images.slice(0,5).map(i=><li key={i.id}><i className={`dot-s ${i.status.toLowerCase()}`}/><span><b>{i.name}</b> {i.status==='Completed'?'was analysed':i.status==='Failed'?'failed to process':'is processing'}</span><small>{fmtDate(i.uploadedAt)}</small></li>)}</ul></div>
 </>);}
