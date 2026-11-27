import { useEffect, useState } from 'react';
import { employeeApi } from '../services/api.js';
import { useApp } from '../context/AppContext.jsx';

export default function Employees() {
  const { notify } = useApp();
  const [rows, setRows] = useState([]);
  const [id, setId] = useState('');
  const [name, setName] = useState('');
  const [files, setFiles] = useState([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [lookupId, setLookupId] = useState('');
  const [details, setDetails] = useState(null);
  const load = () => employeeApi.list().then(data => setRows(data.employees || [])).catch(e => setError(e.message));
  useEffect(() => { load(); }, []);
  const submit = async event => {
    event.preventDefault();
    if (!id.trim() || !name.trim() || files.length < 1 || files.length > 5) return notify('Enter employee ID/name and select 1–5 photos.', 'error');
    setBusy(true); setError('');
    try { await employeeApi.register({ employeeId:id.trim(), employeeName:name.trim(), files:Array.from(files) }); setId(''); setName(''); setFiles([]); notify('Employee registered'); await load(); }
    catch (e) { setError(e.message); notify(e.message, 'error'); }
    finally { setBusy(false); }
  };
  return <div className="stack">
    <section className="card stack"><h3>Register employee</h3>
      <p><small>Upload 1–5 reference photos. The backend creates OSNet reference embeddings.</small></p>
      <form className="stack" onSubmit={submit}>
        <label className="field"><small>Employee ID</small><input className="input" value={id} onChange={e=>setId(e.target.value)} required/></label>
        <label className="field"><small>Employee name</small><input className="input" value={name} onChange={e=>setName(e.target.value)} required/></label>
        <label className="field"><small>Reference photos (JPG, PNG or WEBP; 1–5 files)</small><input className="input" type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={e=>setFiles(e.target.files)} required/></label>
        <small>{files.length} file(s) selected</small>
        <button className="btn" disabled={busy}>{busy ? 'Registering…' : 'Register employee'}</button>
      </form>
      {error && <p className="toast error" style={{position:'static'}}>{error}</p>}
    </section>
    <section className="card stack"><h3>Employee details lookup</h3>
      <div className="row gap"><input className="input" value={lookupId} onChange={e=>setLookupId(e.target.value)} placeholder="Employee ID"/><button className="btn" onClick={async()=>{try{setDetails(await employeeApi.get(lookupId.trim()));}catch(e){notify(e.message,'error');}}} disabled={!lookupId.trim()}>Load details</button></div>
      {details && <pre style={{whiteSpace:'pre-wrap',overflowWrap:'anywhere'}}>{JSON.stringify(details,null,2)}</pre>}
    </section>
    <section className="card stack"><div className="row between"><h3>Registered employees</h3><button className="btn sm ghost" onClick={load}>Refresh</button></div>
      {!rows.length ? <p>No employees registered yet.</p> : <div className="table-wrap"><table><thead><tr><th>Employee ID</th><th>Name</th><th>Reference photos</th><th>Embedding dimension</th></tr></thead>
        <tbody>{rows.map(row=><tr key={row.employee_id}><td>{row.employee_id}</td><td>{row.employee_name}</td><td>{row.total_reference_photos}</td><td>{row.embedding_dimension}</td></tr>)}</tbody></table></div>}
    </section>
  </div>;
}
