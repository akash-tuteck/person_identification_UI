export default function BoundingBoxOverlay({src,objects,show=true,filter='All'}){
 return <div className="viz"><img src={src} alt="Analysed"/>{show&&objects.filter(o=>filter==='All'||o.category===filter).map((o,i)=>
  <div key={i} className="bbox" style={{left:o.box[0]+'%',top:o.box[1]+'%',width:o.box[2]+'%',height:o.box[3]+'%'}}><span>{o.name} {Math.round(o.confidence*100)}%</span></div>)}</div>;}
