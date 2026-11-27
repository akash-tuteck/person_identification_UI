import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Analysis from './pages/Analysis.jsx';
import History from './pages/History.jsx';
import Detection from './pages/Detection.jsx';
import Assistant from './pages/Assistant.jsx';
import Settings from './pages/Settings.jsx';
import Employees from './pages/Employees.jsx';
import VideoProcessing from './pages/VideoProcessing.jsx';

export default function App() {
  return <Routes><Route element={<Layout/>}>
    <Route path="/" element={<Dashboard/>}/>
    <Route path="/analysis" element={<Analysis/>}/>
    <Route path="/history" element={<History/>}/>
    <Route path="/detection" element={<Detection/>}/>
    <Route path="/assistant" element={<Assistant/>}/>
    <Route path="/employees" element={<Employees/>}/>
    <Route path="/videos" element={<VideoProcessing/>}/>
    <Route path="/settings" element={<Settings/>}/>
  </Route></Routes>;
}
