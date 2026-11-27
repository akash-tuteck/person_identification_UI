import { useRef, useState } from 'react';
import { UploadCloud, Loader2, X, Users, ScanSearch, Boxes, Fingerprint } from 'lucide-react';
import { imageApi } from '../services/api.js';
import { useApp } from '../context/AppContext.jsx';

const MAX = 10 * 1024 * 1024;
const accepted = ['image/jpeg', 'image/png', 'image/webp'];

export default function Analysis() {
  const input = useRef(null);
  const { current, setCurrent, addImage, updateImage, notify } = useApp();
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [busy, setBusy] = useState('');
  const [error, setError] = useState('');

  const choose = next => {
    if (!next) return;
    if (!accepted.includes(next.type)) return notify('Choose a JPG, PNG or WEBP image.', 'error');
    if (next.size > MAX) return notify('Image must be 10 MB or smaller.', 'error');
    if (preview) URL.revokeObjectURL(preview);
    setFile(next);
    setPreview(URL.createObjectURL(next));
    setError('');
    setCurrent(null);
  };

  const process = async () => {
    if (!file) return;
    setBusy('process'); setError('');
    try {
      const result = await imageApi.process(file);
      const record = {
        id: result.image_id,
        name: file.name,
        url: preview,
        uploadedAt: new Date().toISOString(),
        status: 'Processed',
        original: result,
        detections: {},
      };
      setCurrent(record); addImage(record);
      notify('Image uploaded and processed');
    } catch (e) {
      setError(e.message); notify(e.message, 'error');
    } finally { setBusy(''); }
  };

  const run = async (key, label, action) => {
    if (!current?.id) return;
    setBusy(key); setError('');
    try {
      const result = await action(current.id);
      const patch = { [key]: result };
      setCurrent(old => ({ ...old, ...patch, detections: { ...(old.detections || {}), [key]: result } }));
      updateImage(current.id, { [key]: result, status: 'Processed' });
      notify(label + ' completed');
    } catch (e) {
      setError(e.message); notify(e.message, 'error');
    } finally { setBusy(''); }
  };

  const detection = current?.automatic || current?.objects;
  const auto = detection?.detection || detection;
  const persons = current?.persons?.persons || [];
  const objects = auto?.objects || current?.objects?.objects || [];
  const busyButton = (key, label, Icon, fn) => (
    <button className="btn" disabled={!!busy} onClick={fn}>
      {busy === key ? <Loader2 className="spin" size={16}/> : <Icon size={16}/>}
      {busy === key ? 'Working…' : label}
    </button>
  );

  return <div className="stack">
    <section className="card pane">
      <h3>Upload image</h3>
      {!current?.id && <div className="drop" onDragOver={e => e.preventDefault()} onDrop={e => { e.preventDefault(); choose(e.dataTransfer.files[0]); }}>
        <UploadCloud size={36}/>
        <h3>Choose an image to process</h3>
        <p>JPG, PNG or WEBP · Maximum 10 MB</p>
        <button className="btn" onClick={() => input.current?.click()}>Browse files</button>
        <input ref={input} hidden type="file" accept="image/jpeg,image/png,image/webp" onChange={e => { choose(e.target.files[0]); e.target.value = ''; }}/>
      </div>}
      {file && !current?.id && <div className="row between">
        <span><b>{file.name}</b> <small>({(file.size / 1024 / 1024).toFixed(2)} MB)</small></span>
        <button className="btn sm ghost" onClick={() => { setFile(null); setPreview(''); }}><X size={14}/> Clear</button>
      </div>}
      {(preview || current?.url || current?.original?.original_image_url) && <img src={preview || current?.url || current?.original?.original_image_url} alt="Original image" style={{maxWidth:'100%',maxHeight:360,objectFit:'contain',alignSelf:'center'}}/>}
      {current?.id && <div><b>Processed image</b><img src={imageApi.processedUrl(current.id)} alt="Processed image" style={{display:'block',maxWidth:'100%',maxHeight:360,objectFit:'contain',marginTop:8}}/></div>}
      {!current?.id && busyButton('process', 'Upload and process', UploadCloud, process)}
      {current?.id && <div className="row between"><span><b>{current.name}</b><br/><small>Image ID: {current.id}</small></span><button className="btn sm ghost" onClick={() => { setCurrent(null); setFile(null); setPreview(''); }}>New image</button></div>}
    </section>

    {current?.id && <>
      <section className="card stack">
        <h3>Image processing APIs</h3>
        <p><small>Run the backend operations below. Model operations may take a few minutes on CPU.</small></p>
        <div className="row gap">
          {busyButton('persons', 'Detect people', Users, () => run('persons', 'Person detection', imageApi.detectPersons))}
          {busyButton('objects', 'Detect objects', Boxes, () => run('objects', 'Object detection', imageApi.detectObjects))}
          {busyButton('automatic', 'Automatic Gemma + Grounding DINO', ScanSearch, () => run('automatic', 'Automatic object detection', imageApi.detectObjectsAutomatically))}
        </div>
        <div className="row gap">
          {busyButton('personFeatures', 'Extract OSNet features', Fingerprint, () => run('personFeatures', 'OSNet feature extraction', imageApi.extractPersonFeatures))}
          {busyButton('objectFeatures', 'Extract DINOv2 object features', Fingerprint, () => run('objectFeatures', 'Object feature extraction', imageApi.extractObjectFeatures))}
        </div>
        {error && <p className="toast error" style={{position:'static'}}>{error}</p>}
      </section>

      <section className="card stack">
        <h3>Results</h3>
        <div className="grid2">
          <div><small>Image ID</small><p><b>{current.id}</b></p></div>
          <div><small>Processed dimensions</small><p><b>{current.original?.processed_width} × {current.original?.processed_height}</b></p></div>
          <div><small>People detected</small><p><b>{persons.length || current.persons?.total_persons || 0}</b></p></div>
          <div><small>Objects detected</small><p><b>{objects.length || current.objects?.total_objects || 0}</b></p></div>
        </div>
        {current.persons?.annotated_image_url && <div><b>Person detection</b><img src={current.persons.annotated_image_url} alt="Person detections" style={{display:'block',maxWidth:'100%',maxHeight:420,marginTop:8}}/></div>}
        {(current.automatic?.detection?.annotated_image_url || current.objects?.annotated_image_url) && <div><b>Object detection</b><img src={current.automatic?.detection?.annotated_image_url || current.objects?.annotated_image_url} alt="Object detections" style={{display:'block',maxWidth:'100%',maxHeight:420,marginTop:8}}/></div>}
        {persons.map(person => <div className="row gap" key={person.person_number}><img src={person.crop_image_url} alt="Person crop" style={{width:80,height:100,objectFit:'cover'}}/><span>Person {person.person_number} · {Math.round(person.confidence * 100)}% confidence</span></div>)}
        {objects.map((object, i) => <div className="row gap" key={object.crop_filename || i}>{object.crop_image_url && <img src={object.crop_image_url} alt={object.category} style={{width:72,height:72,objectFit:'cover'}}/>}<span>{object.category} · {Math.round((object.confidence || 0) * 100)}% confidence</span></div>)}
        {Object.entries(current.detections || {}).map(([key, value]) => <details key={key}><summary>{key} raw API response</summary><pre style={{whiteSpace:'pre-wrap',overflowWrap:'anywhere',fontSize:12}}>{JSON.stringify(value, null, 2)}</pre></details>)}
      </section>
    </>}
  </div>;
}
