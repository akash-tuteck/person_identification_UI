import axios from 'axios';

const http = axios.create({
  baseURL: (import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000').replace(/\/$/, ''),
  timeout: 0,
});

http.interceptors.response.use(
  response => response,
  error => {
    const detail = error.response?.data?.detail || error.response?.data?.message;
    error.message = detail || error.message || 'Unable to reach the API server';
    return Promise.reject(error);
  }
);

const dataOf = response => response.data?.data ?? response.data;
const uploadFile = (url, file, field = 'file', extra = {}) => {
  const body = new FormData();
  body.append(field, file);
  Object.entries(extra).forEach(([key, value]) => body.append(key, value));
  return http.post(url, body).then(dataOf);
};

export const healthApi = {
  check: async () => (await http.get('/health')).data,
};

export const imageApi = {
  process: file => uploadFile('/process', file),
  processedUrl: id => `${http.defaults.baseURL}/process/${id}/processed`,
  processed: id => http.get(`/process/${id}/processed`, { responseType: 'blob' }),
  detectPersons: id => http.post(`/process/${id}/detect-persons`).then(dataOf),
  detectObjects: (id, objectCategories) =>
    http.post(`/process/${id}/detect-objects`, { object_categories: objectCategories ?? null }).then(dataOf),
  detectObjectsAutomatically: id =>
    http.post(`/process/${id}/detect-objects-automatically`).then(dataOf),
  extractPersonFeatures: id =>
    http.post(`/process/${id}/extract-features`).then(dataOf),
  compareImages: (imageId1, imageIds) =>
    http.post('/process/compare-images', { image_id_1: imageId1, image_id_2: imageIds }).then(dataOf),
  extractObjectFeatures: id =>
    http.post(`/process/${id}/extract-object-features`).then(dataOf),
  compareObjects: (imageId1, imageIds) =>
    http.post('/process/compare-objects', { image_id_1: imageId1, image_id_2: imageIds }).then(dataOf),
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
  extractFrames: (id, intervalSeconds = 1) =>
    http.post(`/videos/${id}/extract-frames`, null, { params: { interval_seconds: intervalSeconds } }).then(dataOf),
  detectPersons: (id, intervalSeconds = 1) =>
    http.post(`/videos/${id}/detect-persons`, null, { params: { interval_seconds: intervalSeconds } }).then(dataOf),
  extractFeatures: (id, intervalSeconds = 1) =>
    http.post(`/videos/${id}/extract-features`, null, { params: { interval_seconds: intervalSeconds } }).then(dataOf),
  trackPersons: id => http.post(`/videos/${id}/track-persons`).then(dataOf),
  compareReference: (id, referenceImageId, options = {}) =>
    http.post(`/videos/${id}/compare-reference`, null, {
      params: { reference_image_id: referenceImageId, ...options },
    }).then(dataOf),
  detectObjects: id => http.post(`/videos/${id}/detect-objects`).then(dataOf),
  matchEmployees: id => http.post(`/videos/${id}/match-employees`).then(dataOf),
};

export default http;
