import { useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { LayoutDashboard, ScanSearch, History, Boxes, Users, Video, GitCompare, Settings, Menu, Sparkles, ChevronLeft } from 'lucide-react';

const nav = [
  ['/', 'Dashboard', LayoutDashboard],
  ['/analysis', 'Image Processing', ScanSearch],
  ['/detection', 'Detection Results', Boxes],
  ['/assistant', 'Image Matching', GitCompare],
  ['/employees', 'Employee Registry', Users],
  ['/videos', 'Video Processing', Video],
  ['/history', 'Session History', History],
  ['/settings', 'Settings', Settings],
];

export default function Layout() {
  const [collapsed,setCollapsed] = useState(false);
  const [open,setOpen] = useState(false);
  const { pathname } = useLocation();
  const title = nav.find(item => item[0] === pathname)?.[1] || 'Person Re-Identification';
  return <div className={`shell ${collapsed?'collapsed':''}`}>
    <aside className={`sidebar ${open?'open':''}`}>
      <div className="brand"><span className="logo"><Sparkles size={18}/></span><b>Person ID</b>
        <button className="icon-btn hide-mobile" onClick={()=>setCollapsed(!collapsed)} aria-label="Collapse sidebar"><ChevronLeft size={16}/></button>
      </div>
      <nav>{nav.map(([to,label,Icon])=><NavLink key={to} to={to} end={to==='/'} onClick={()=>setOpen(false)} className="nav-item" title={label}><Icon size={18}/><span>{label}</span></NavLink>)}</nav>
      <div className="profile"><div className="avatar">PR</div><div><b>Person Re-ID</b><small>POC</small></div></div>
    </aside>
    {open&&<div className="scrim" onClick={()=>setOpen(false)}/>}
    <div className="main">
      <header className="topbar">
        <button className="icon-btn show-mobile" onClick={()=>setOpen(true)} aria-label="Open menu"><Menu size={20}/></button>
        <h1>{title}</h1>
        <span className="badge completed">API UI</span>
      </header>
      <main className="content"><Outlet/></main>
    </div>
  </div>;
}
