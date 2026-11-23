import {Cpu,ShieldCheck} from 'lucide-react';import {useApp} from '../context/AppContext.jsx';
const Sec=({t,children})=><section className="card"><h3>{t}</h3>{children}</section>;
const Field=({l,children})=><label className="field"><small>{l}</small>{children}</label>;
export default function Settings(){const {notify}=useApp();
 return(<div className="stack"><Sec t="User profile"><div className="grid2"><Field l="Full name"><input className="input" defaultValue="Alex Kumar"/></Field><Field l="Email"><input className="input" defaultValue="alex@documind.ai"/></Field></div></Sec>
 <Sec t="Application preferences"><div className="grid2"><Field l="Theme"><select className="input" defaultValue="Light"><option>Light</option><option disabled>Dark (coming soon)</option></select></Field><Field l="Language"><select className="input"><option>English</option></select></Field></div></Sec>
 <Sec t="Image storage"><div className="grid2"><Field l="Retention"><select className="input"><option>Keep 30 days</option><option>Keep 90 days</option><option>Keep forever</option></select></Field><Field l="Storage used"><progress value="42" max="100"/></Field></div></Sec>
 <Sec t="Default analysis options">{['People analysis','Object detection','Scene analysis','Text recognition'].map(o=><label key={o} className="check"><input type="checkbox" defaultChecked/> {o}</label>)}</Sec>
 <Sec t="AI model"><div className="row gap"><Cpu size={20}/><b>Local AI Engine – Ollama / Qwen3-VL</b></div><p className="ok"><ShieldCheck size={16}/> Processing runs locally. No images are sent to external AI APIs.</p></Sec>
 <button className="btn" onClick={()=>notify('Settings saved')}>Save changes</button></div>);}
