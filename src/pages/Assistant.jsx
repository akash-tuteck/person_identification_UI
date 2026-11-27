import { useState } from 'react';
import { imageApi } from '../services/api.js';
import { useApp } from '../context/AppContext.jsx';
import { Empty } from '../components/ui.jsx';

export default function Assistant() {
  const { images, current, notify } = useApp();
  const [source, setSource] = useState(current?.id || '');
  const [targets, setTargets] = useState('');
  const [mode, setMode] = useState('people');
  const [result, setResult] = useState(null);
  const [busy, setBusy] = useState(false);
  if (!images.length) return <Empty title="No processed images in this session" text="Process at least two images to compare their detected people or objects." to="/analysis" cta="Process an image"/>;

  const compare = async event => {
    event.preventDefault();
    const ids = targets.split(/[\s,]+/).map(value => value.trim()).filter(Boolean);
    if (!source || !ids.length) return notify('Enter one or more search image IDs.', 'error');
    setBusy(true); setResult(null);
    try {
      const response = mode === 'people'
        ? await imageApi.compareImages(source, ids)
        : await imageApi.compareObjects(source, ids);
      setResult(response); notify('Comparison completed');
    } catch (error) { notify(error.message, 'error'); }
    finally { setBusy(false); }
  };

  return <div className="stack">
    <section className="card stack">
      <h3>Image matching</h3>
      <p>Compare a processed reference image with one or more processed search images. Run person or object feature extraction on the images first.</p>
      <form className="stack" onSubmit={compare}>
        <label className="field"><small>Reference image ID</small><input className="input" value={source} onChange={e => setSource(e.target.value)} placeholder="UUID of reference image"/></label>
        <label className="field"><small>Search image IDs (comma or space separated)</small><textarea className="input" rows={3} value={targets} onChange={e => setTargets(e.target.value)} placeholder="UUID 1, UUID 2"/></label>
        <label className="field"><small>Matching type</small><select className="input" value={mode} onChange={e => setMode(e.target.value)}><option value="people">Person matching (OSNet)</option><option value="objects">Object matching (DINOv2)</option></select></label>
        <button className="btn" disabled={busy}>{busy ? 'Comparing…' : 'Compare images'}</button>
      </form>
    </section>
    {images.length > 0 && <section className="card stack"><h3>Images processed this session</h3>
      {images.map(image => <div className="kv" key={image.id}><span><b>{image.name}</b><br/><small>{image.id}</small></span><button className="btn sm ghost" onClick={() => setSource(image.id)}>Use as reference</button></div>)}
    </section>}
    {result && <section className="card stack"><h3>Comparison response</h3><pre style={{whiteSpace:'pre-wrap',overflowWrap:'anywhere'}}>{JSON.stringify(result, null, 2)}</pre></section>}
  </div>;
}
