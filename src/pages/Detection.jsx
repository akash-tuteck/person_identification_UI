import { useApp } from '../context/AppContext.jsx';
import { Empty } from '../components/ui.jsx';

export default function Detection() {
  const { current } = useApp();
  if (!current?.id) return <Empty title="No processed image" text="Upload and process an image first." to="/analysis" cta="Open image processing"/>;

  const personResult = current.persons;
  const objectResult = current.automatic?.detection || current.automatic || current.objects;
  const people = personResult?.persons || [];
  const objects = objectResult?.objects || [];

  return <div className="stack">
    <section className="card stack">
      <h3>Detection results</h3>
      <p><small>{current.name} · {current.id}</small></p>
      <div className="grid2">
        <div><small>People detected</small><h2>{personResult?.total_persons ?? people.length}</h2></div>
        <div><small>Objects detected</small><h2>{objectResult?.total_objects ?? objects.length}</h2></div>
      </div>
    </section>
    {personResult ? <section className="card stack">
      <h3>Person detections</h3>
      {personResult.annotated_image_url && <img src={personResult.annotated_image_url} alt="Person detections" style={{maxWidth:'100%',maxHeight:480,objectFit:'contain'}}/>}
      <div className="grid">{people.map(person => <div className="card" key={person.person_number}>
        <img src={person.crop_image_url} alt={`Person ${person.person_number}`} style={{width:'100%',maxHeight:180,objectFit:'contain'}}/>
        <b>Person {person.person_number}</b><small>{Math.round(person.confidence * 100)}% confidence</small>
        <small>{JSON.stringify(person.bounding_box)}</small>
      </div>)}</div>
    </section> : <section className="card"><p>Run Detect people from Image Analysis to see person crops.</p></section>}
    {objectResult ? <section className="card stack">
      <h3>Object detections</h3>
      {objectResult.annotated_image_url && <img src={objectResult.annotated_image_url} alt="Object detections" style={{maxWidth:'100%',maxHeight:480,objectFit:'contain'}}/>}
      <div className="table-wrap"><table><thead><tr><th>Category</th><th>Confidence</th><th>Bounding box</th><th>Crop</th></tr></thead>
        <tbody>{objects.map((object, index) => <tr key={object.crop_filename || index}>
          <td>{object.category}</td><td>{Math.round((object.confidence || 0) * 100)}%</td><td>{JSON.stringify(object.bounding_box)}</td>
          <td>{object.crop_image_url ? <a href={object.crop_image_url} target="_blank" rel="noreferrer">View crop</a> : '—'}</td>
        </tr>)}</tbody></table></div>
    </section> : <section className="card"><p>Run Detect objects or Automatic Gemma + Grounding DINO from Image Analysis to see object results.</p></section>}
  </div>;
}
