import { useNavigate } from 'react-router-dom';
import { Images, Users, Boxes, CheckCircle2 } from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';
import { StatCard, ImageCard } from '../components/ui.jsx';

export default function Dashboard() {
  const { images, setCurrent } = useApp();
  const nav = useNavigate();
  const people = images.reduce((sum, image) => sum + (image.persons?.total_persons || 0), 0);
  const objects = images.reduce((sum, image) => sum + (image.automatic?.detection?.total_objects || image.objects?.total_objects || 0), 0);
  return <>
    <section className="card hero"><div><h2>Person Re-Identification</h2><p>Upload images and videos, detect people and objects, extract features and compare matches.</p></div>
      <button className="btn lg" onClick={() => { setCurrent(null); nav('/analysis'); }}>Process an image</button>
    </section>
    <div className="grid stats">
      <StatCard icon={Images} label="Images processed this session" value={images.length} tone="p"/>
      <StatCard icon={Users} label="People detected" value={people} tone="b"/>
      <StatCard icon={Boxes} label="Objects detected" value={objects} tone="p"/>
      <StatCard icon={CheckCircle2} label="API workflows" value="Connected" tone="b"/>
    </div>
    <h3 className="section">Recent images (this session)</h3>
    {!images.length ? <div className="card empty"><h3>No images processed yet</h3><p>Upload an image to start using the backend.</p><button className="btn" onClick={() => nav('/analysis')}>Upload image</button></div> :
      <div className="grid">{images.slice(0, 6).map(image => <ImageCard key={image.id} img={{...image,people:image.persons?.total_persons||0,objects:image.automatic?.detection?.total_objects||image.objects?.total_objects||0,status:'Processed'}} onView={() => { setCurrent(image); nav('/analysis'); }}/>)}</div>}
  </>;
}
