import {useState} from 'react';import {NavLink,Outlet,useLocation} from 'react-router-dom';
import {LayoutDashboard,ScanSearch,History,Boxes,Bot,Settings,Bell,Search,Menu,Sparkles,ChevronLeft} from 'lucide-react';
const nav=[['/','Dashboard',LayoutDashboard],['/analysis','Image Analysis',ScanSearch],['/history','Image History',History],['/detection','Object Detection',Boxes],['/assistant','AI Assistant',Bot],['/settings','Settings',Settings]];
export default function Layout(){
 const [collapsed,setCollapsed]=useState(false),[open,setOpen]=useState(false),[menu,setMenu]=useState(false);
 const {pathname}=useLocation();const title=nav.find(n=>n[0]===pathname)?.[1]||'DocuMind AI';
 return(<div className={`shell ${collapsed?'collapsed':''}`}>
 <aside className={`sidebar ${open?'open':''}`}>
  <div className="brand"><span className="logo"><Sparkles size={18}/></span><b>DocuMind AI</b>
   <button className="icon-btn hide-mobile" onClick={()=>setCollapsed(!collapsed)} aria-label="Collapse sidebar"><ChevronLeft size={16}/></button></div>
  <nav>{nav.map(([to,label,Icon])=><NavLink key={to} to={to} end={to==='/'} onClick={()=>setOpen(false)} className="nav-item" title={label}><Icon size={18}/><span>{label}</span></NavLink>)}</nav>
  <div className="profile"><div className="avatar">AK</div><div><b>Alex Kumar</b><small>Admin</small></div></div>
 </aside>
 {open&&<div className="scrim" onClick={()=>setOpen(false)}/>}
 <div className="main">
  <header className="topbar">
   <button className="icon-btn show-mobile" onClick={()=>setOpen(true)} aria-label="Open menu"><Menu size={20}/></button>
   <h1>{title}</h1>
   <label className="search"><Search size={16}/><input placeholder="Search images, objects…"/></label>
   <button className="icon-btn" aria-label="Notifications"><Bell size={18}/><i className="dot"/></button>
   <div className="menu-wrap"><button className="avatar" onClick={()=>setMenu(!menu)}>AK</button>
    {menu&&<div className="dropdown"><NavLink to="/settings" onClick={()=>setMenu(false)}>Profile and settings</NavLink><a href="#signout" onClick={e=>e.preventDefault()}>Sign out</a></div>}</div>
  </header>
  <main className="content"><Outlet/></main>
 </div></div>);
}
