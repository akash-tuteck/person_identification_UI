import {createContext,useContext,useState,useEffect} from 'react';
import {imageApi} from '../services/api.js';
const Ctx=createContext();export const useApp=()=>useContext(Ctx);
export function AppProvider({children}){
 const [images,setImages]=useState([]);const [loading,setLoading]=useState(true);
 const [current,setCurrent]=useState(null);const [toast,setToast]=useState(null);
 useEffect(()=>{imageApi.list().then(d=>{setImages(d);setLoading(false);});},[]);
 const notify=(msg,type='success')=>{setToast({msg,type});setTimeout(()=>setToast(null),3000);};
 const refresh=async()=>setImages(await imageApi.list());
 const remove=async id=>{await imageApi.remove(id);await refresh();notify('Image deleted');};
 return <Ctx.Provider value={{images,loading,current,setCurrent,notify,refresh,remove}}>{children}
 {toast&&<div className={`toast ${toast.type}`} role="status">{toast.msg}</div>}</Ctx.Provider>;
}
