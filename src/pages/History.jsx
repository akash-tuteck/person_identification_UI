import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';
import { ImageCard, Empty } from '../components/ui.jsx';

export default function History() {
  const { images, setCurrent, remove } = useApp();
  const nav = useNavigate();
  const [query, setQuery] = useState('');
  const rows = images.filter(image => image.name.toLowerCase().includes(query.toLowerCase()));
  if (!images.length) return <Empty title="No session history" text="Processed images appear here until you refresh or close this browser session." to="/analysis" cta="Process an image"/>;
  return <div className="stack">
    <section className="card"><input className="input" placeholder="Search by filename" value={query} onChange={e => setQuery(e.target.value)}/></section>
    {!rows.length ? <Empty title="No matching images" text="Try another filename."/> :
      <div className="grid">{rows.map(image => <ImageCard key={image.id} img={{...image,people:image.persons?.total_persons||0,objects:image.automatic?.detection?.total_objects||image.objects?.total_objects||0,status:'Processed'}} onView={() => { setCurrent(image); nav('/analysis'); }} onDelete={() => remove(image.id)}/>)}</div>}
  </div>;
}
