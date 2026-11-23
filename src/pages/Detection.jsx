import {useState} from 'react';import {BarChart,Bar,XAxis,YAxis,Tooltip,ResponsiveContainer} from 'recharts';
import {useApp} from '../context/AppContext.jsx';import BoundingBoxOverlay from '../components/BoundingBoxOverlay.jsx';import {Empty} from '../components/ui.jsx';
export default function Detection(){const {current}=useApp();const [f,setF]=useState('All');const a=current?.analysis;
 if(!a)return <Empty title="No analysed image" text="Analyse an image first to explore its detected objects." to="/analysis" cta="Go to Image Analysis"/>;
 const cats=[...new Set(a.objects.map(o=>o.category))];const data=cats.map(c=>({category:c,count:a.objects.filter(o=>o.category===c).reduce((n,o)=>n+o.count,0)}));
 const list=a.objects.filter(o=>f==='All'||o.category===f);
 return(<div className="split"><section className="card pane"><BoundingBoxOverlay src={current.url} objects={a.objects} filter={f}/>
  <div className="chips">{['All',...cats].map(c=><button key={c} className={`chip ${f===c?'on':''}`} onClick={()=>setF(c)}>{c}</button>)}</div></section>
 <section className="card pane"><h3>{a.objects.reduce((n,o)=>n+o.count,0)} objects in {cats.length} categories</h3>
  <div style={{height:200}}><ResponsiveContainer><BarChart data={data}><XAxis dataKey="category" fontSize={12}/><YAxis allowDecimals={false} fontSize={12}/><Tooltip/><Bar dataKey="count" fill="#6d5dfc" radius={[6,6,0,0]}/></BarChart></ResponsiveContainer></div>
  {list.map((o,i)=><div key={i} className="kv"><span><b>{o.name}</b> <small>{o.category}</small></span><span>{Math.round(o.confidence*100)}%</span></div>)}</section></div>);}
