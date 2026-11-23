import {useState,useRef,useEffect} from 'react';import {Send,Trash2,Bot,User} from 'lucide-react';
import {imageApi} from '../services/api.js';import {suggestions} from '../services/mockData.js';import {useApp} from '../context/AppContext.jsx';import {Empty} from '../components/ui.jsx';
export default function Assistant(){const {current}=useApp();const [msgs,setMsgs]=useState([]),[q,setQ]=useState(''),[busy,setBusy]=useState(false);const end=useRef();
 useEffect(()=>end.current?.scrollIntoView({behavior:'smooth'}),[msgs,busy]);
 if(!current)return <Empty title="No image attached" text="Upload an image to start asking questions about it." to="/analysis" cta="Upload an image"/>;
 const send=async t=>{t=t.trim();if(!t||busy)return;setQ('');setMsgs(m=>[...m,{r:'user',t}]);setBusy(true);
  try{const ans=await imageApi.ask(current.id,t);setMsgs(m=>[...m,{r:'ai',t:ans}]);}catch{setMsgs(m=>[...m,{r:'ai',t:'I could not answer that. Please try again.'}]);}setBusy(false);};
 return(<div className="split chat-split"><section className="card pane"><img className="chat-img" src={current.url} alt="Attached"/><small>{current.name}</small></section>
 <section className="card pane chat"><div className="row between"><b>Ask about this image</b><button className="btn sm ghost" onClick={()=>setMsgs([])}><Trash2 size={14}/>Clear conversation</button></div>
  <div className="msgs">{!msgs.length&&<div className="chips">{suggestions.map(s=><button key={s} className="chip" onClick={()=>send(s)}>{s}</button>)}</div>}
   {msgs.map((m,i)=><div key={i} className={`msg ${m.r}`}><span className="avatar sm">{m.r==='ai'?<Bot size={14}/>:<User size={14}/>}</span><div className="bubble">{m.t}</div></div>)}
   {busy&&<div className="msg ai"><span className="avatar sm"><Bot size={14}/></span><div className="bubble">Thinking…</div></div>}<div ref={end}/></div>
  <form className="row gap" onSubmit={e=>{e.preventDefault();send(q)}}><input className="input" value={q} onChange={e=>setQ(e.target.value)} placeholder="Ask a question about the image"/><button className="btn" aria-label="Send"><Send size={16}/></button></form>
 </section></div>);}
