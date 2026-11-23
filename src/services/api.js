import axios from 'axios';
import { seedImages, mockAnalysis, mockAnswer } from './mockData.js';
const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false';
const http = axios.create({ baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000' });
const wait = ms => new Promise(r => setTimeout(r, ms));
let db = [...seedImages];
// Set VITE_USE_MOCK=false to call the FastAPI backend; response shapes should match the mocks.
export const imageApi = {
    list: async () => USE_MOCK ? (await wait(400), [...db]) : (await http.get('/api/v1/images')).data,
    get: async id => USE_MOCK ? db.find(i => i.id === id) : (await http.get(`/api/v1/images/${id}`)).data,
    upload: async file => {
        if (!USE_MOCK) { const f = new FormData(); f.append('file', file); return (await http.post('/api/v1/images/upload', f)).data; }
        await wait(500); const r = { id: 'img_' + Date.now(), name: file.name, hue: 250, url: null, uploadedAt: new Date().toISOString(), status: 'Processing', people: 0, objects: 0, categories: [] }; db = [r, ...db]; return r;
    },
    analyze: async id => {
        if (!USE_MOCK) return (await http.post(`/api/v1/images/${id}/analyze`)).data;
        await wait(2200); const people = mockAnalysis.people.length, objects = mockAnalysis.objects.reduce((n, o) => n + o.count, 0);
        db = db.map(i => i.id === id ? { ...i, status: 'Completed', people, objects, categories: [...new Set(mockAnalysis.objects.map(o => o.category))] } : i); return mockAnalysis;
    },
    analysis: async id => USE_MOCK ? mockAnalysis : (await http.get(`/api/v1/images/${id}/analysis`)).data,
    ask: async (id, question) => { if (!USE_MOCK) return (await http.post(`/api/v1/images/${id}/ask`, { question })).data.answer; await wait(900); return mockAnswer(question); },
    remove: async id => { if (!USE_MOCK) return http.delete(`/api/v1/images/${id}`); await wait(200); db = db.filter(i => i.id !== id); }
};
