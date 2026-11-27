import axios from 'axios';

const baseURL = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');
const http = axios.create({ baseURL, timeout: 0 });

http.interceptors.response.use(response => response, error => {
  const detail = error.response?.data?.detail || error.response?.data?.message;
  error.message = detail || error.message || 'Unable to reach the API server';
  return Promise.reject(error);
});

const dataOf = response => response.data?.data ?? response.data;
const uploadFile = (url, file, field = 'file') => {
  const body = new FormData();
  body.append(field, file);
  return http.post(url, body).then(dataOf);
};

export const healthApi = { check: async () => (await http.get('/health')).data };

export const imageApi = {
  process: file => uploadFile('/process', file),
  processedUrl: id => `${baseURL}/process/${id}/processed`,
  detectPersons: id => http.post(`/process/${id}/detect-persons`).then(dataOf),
  detectObjects: (id, categories) => http.post(`/process/${id}/detect-objects`, { object_categories: categories ?? null }).then(dataOf),
  detectObjectsAutomatically: id => http.post(`/process/${id}/detect-objects-automatically`).then(dataOf),
  extractPersonFeatures: id => http.post(`/process/${id}/extract-features`).then(dataOf),
  compareImages: (id1, ids) => http.post('/process/compare-images', { image_id_1: id1, image_id_2: ids }).then(dataOf),
  extractObjectFeatures: id => http.post(`/process/${id}/extract-object-features`).then(dataOf),
  compareObjects: (id1, ids) => http.post('/process/compare-objects', { image_id_1: id1, image_id_2: ids }).then(dataOf),
};

export const employeeApi = {
  list: async () => (await http.get('/employees')).data,
  get: id => http.get(`/employees/${encodeURIComponent(id)}`).then(dataOf),
  register: ({ employeeId, employeeName, files }) => {
    const body = new FormData();
    body.append('employee_id', employeeId);
    body.append('employee_name', employeeName);
    files.forEach(file => body.append('files', file));
    return http.post('/employees/register', body).then(dataOf);
  },
};

export const videoApi = {
  upload: file => uploadFile('/videos/upload', file),
  get: id => http.get(`/videos/${id}`).then(dataOf),
  extractFrames: (id, interval = 1) => http.post(`/videos/${id}/extract-frames`, null, { params: { interval_seconds: interval } }).then(dataOf),
  detectPersons: (id, interval = 1) => http.post(`/videos/${id}/detect-persons`, null, { params: { interval_seconds: interval } }).then(dataOf),
  extractFeatures: (id, interval = 1) => http.post(`/videos/${id}/extract-features`, null, { params: { interval_seconds: interval } }).then(dataOf),
  trackPersons: id => http.post(`/videos/${id}/track-persons`).then(dataOf),
  compareReference: (id, referenceId, options = {}) => http.post(`/videos/${id}/compare-reference`, null, { params: { reference_image_id: referenceId, ...options } }).then(dataOf),
  detectObjects: id => http.post(`/videos/${id}/detect-objects`).then(dataOf),
  matchEmployees: id => http.post(`/videos/${id}/match-employees`).then(dataOf),
};

export default http;
