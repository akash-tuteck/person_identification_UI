import { useState } from 'react';
import { videoApi } from '../services/api.js';
import { useApp } from '../context/AppContext.jsx';

const actions = [
  ['frames','Extract frames',api=>api.extractFrames],
];
export default function VideoProcessing() {
  const { notify } = useApp();
  const [file,setFile] = useState(null);
  const [video,setVideo] = useState(null);
  const [interval,setInterval] = useState(1);
  const [reference,setReference] = useState('');
  const [busy,setBusy] = useState('');
  const [results,setResults] = useState({});
  const [error,setError] = useState('');
  const upload = async () => {
    if(!file) return;
    setBusy('upload'); setError('');
    try { const data=await videoApi.upload(file); setVideo(data); setResults({}); notify('Video uploaded'); }
    catch(e){setError(e.message);notify(e.message,'error');}
    finally{setBusy('');}
  };
  const run = async (key,label,fn) => {
    if(!video?.video_id) return;
    setBusy(key);setError('');
    try{const data=await fn(video.video_id);setResults(old=>({...old,[key]:data}));notify(label+' completed');}
    catch(e){setError(e.message);notify(e.message,'error');}
    finally{setBusy('');}
  };
  const buttons = [
    ['frames','Extract frames',id=>videoApi.extractFrames(id,Number(interval))],
    ['persons','Detect people',id=>videoApi.detectPersons(id,Number(interval))],
    ['features','Extract OSNet features',id=>videoApi.extractFeatures(id,Number(interval))],
    ['tracking','Track people',id=>videoApi.trackPersons(id)],
    ['objects','Detect video objects',id=>videoApi.detectObjects(id)],
    ['employees','Match registered employees',id=>videoApi.matchEmployees(id)],
  ];
  return <div className="stack">
    <section className="card stack"><h3>Upload video</h3><p><small>Supported: MP4, AVI, MOV, MKV · Maximum 500 MB</small></p>
      <input className="input" type="file" accept="video/mp4,video/x-msvideo,video/quicktime,video/x-matroska,.mkv" onChange={e=>setFile(e.target.files[0]||null)}/>
      {file&&<p>{file.name} · {(file.size/1024/1024).toFixed(1)} MB</p>}
      <button className="btn" disabled={!file||!!busy} onClick={upload}>{busy==='upload'?'Uploading…':'Upload video'}</button>
    </section>
    {video?.video_id&&<section className="card stack"><h3>Video workflow</h3>
      <div className="kv"><span>Video ID</span><b>{video.video_id}</b></div>
      <div className="kv"><span>Filename</span><b>{video.original_filename}</b></div>
      <label className="field"><small>Frame interval (seconds)</small><input className="input" type="number" min="0.1" step="0.1" value={interval} onChange={e=>setInterval(e.target.value)}/></label>
      <div className="row gap wrap">{buttons.map(([key,label,fn])=><button key={key} className="btn" disabled={!!busy} onClick={()=>run(key,label,fn)}>{busy===key?'Running…':label}</button>)}</div>
      <label className="field"><small>Reference image ID for video matching</small><input className="input" value={reference} onChange={e=>setReference(e.target.value)} placeholder="Processed reference image UUID"/></label>
      <button className="btn" disabled={!!busy||!reference.trim()} onClick={()=>run('matching','Reference matching',id=>videoApi.compareReference(id,reference.trim(),{interval_seconds:Number(interval)}))}>Compare with reference image</button>
      {error&&<p className="toast error" style={{position:'static'}}>{error}</p>}
    </section>}
    {Object.keys(results).length>0&&<section className="card stack"><h3>Video API results</h3>{Object.entries(results).map(([key,value])=><details key={key} open><summary>{key}</summary><pre style={{whiteSpace:'pre-wrap',overflowWrap:'anywhere',fontSize:12}}>{JSON.stringify(value,null,2)}</pre></details>)}</section>}
  </div>;
}
