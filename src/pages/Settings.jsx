import { useEffect, useState } from 'react';
import { healthApi } from '../services/api.js';

export default function Settings() {
  const [status, setStatus] = useState('Checking…');
  const [error, setError] = useState('');
  useEffect(() => {
    healthApi.check().then(data => { setStatus(data.status || 'healthy'); setError(''); })
      .catch(e => { setStatus('Unavailable'); setError(e.message); });
  }, []);
  return <div className="stack">
    <section className="card stack"><h3>Backend connection</h3>
      <div className="kv"><span>API status</span><b>{status}</b></div>
      <div className="kv"><span>Backend URL</span><b>{import.meta.env.VITE_API_BASE_URL || 'Vite proxy → http://127.0.0.1:8000'}</b></div>
      {error && <p className="toast error" style={{position:'static'}}>{error}</p>}
      <button className="btn" onClick={() => { setStatus('Checking…'); healthApi.check().then(d => setStatus(d.status || 'healthy')).catch(e => { setStatus('Unavailable'); setError(e.message); }); }}>Check connection</button>
    </section>
    <section className="card stack"><h3>Connected backend capabilities</h3>
      <p>Image processing, YOLO person detection, YOLO object detection, Gemma + Grounding DINO automatic object detection, OSNet person embeddings, DINOv2 object features, image comparison, employee registration and video processing.</p>
      <small>Application settings and user profiles are not persisted by the current backend.</small>
    </section>
  </div>;
}
