import { createContext, useContext, useState } from 'react';

const Ctx = createContext(null);
export const useApp = () => useContext(Ctx);

export function AppProvider({ children }) {
  const [images, setImages] = useState([]);
  const [current, setCurrent] = useState(null);
  const [toast, setToast] = useState(null);

  const notify = (msg, type = 'success') => {
    setToast({ msg, type });
    window.clearTimeout(notify.timer);
    notify.timer = window.setTimeout(() => setToast(null), 3500);
  };
  const addImage = image => setImages(rows => [image, ...rows.filter(row => row.id !== image.id)]);
  const updateImage = (id, patch) => setImages(rows => rows.map(row => row.id === id ? { ...row, ...patch } : row));
  const refresh = async () => {};
  const remove = async id => {
    setImages(rows => rows.filter(row => row.id !== id));
    if (current?.id === id) setCurrent(null);
    notify('Removed from this session');
  };

  return <Ctx.Provider value={{ images, loading: false, current, setCurrent, notify, refresh, remove, addImage, updateImage }}>
    {children}
    {toast && <div className={`toast ${toast.type}`} role="status">{toast.msg}</div>}
  </Ctx.Provider>;
}
