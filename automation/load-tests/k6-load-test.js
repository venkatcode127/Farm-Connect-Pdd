import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '10s', target: 20 },
    { duration: '20s', target: 50 },
    { duration: '10s', target: 0 },
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'],
    http_req_failed: ['rate<0.01'],
  },
};

const BASE_URL = __ENV.TARGET_URL || 'http://127.0.0.1:8080';

export default function () {
  // 1. Health check & root
  const resRoot = http.get(`${BASE_URL}/`);
  check(resRoot, {
    'API is healthy (200)': (r) => r.status === 200,
  });

  // 2. Mandi Market Prices API
  const resMandi = http.get(`${BASE_URL}/api/mandi-prices`);
  check(resMandi, {
    'Mandi Prices status is 200 or 404': (r) => [200, 404].includes(r.status),
  });

  // 3. AI Crop Prediction Endpoint
  const payload = JSON.stringify({
    N: 90,
    P: 42,
    K: 43,
    temperature: 20.87,
    humidity: 82.00,
    ph: 6.50,
    rainfall: 202.93
  });
  const params = {
    headers: { 'Content-Type': 'application/json' },
  };
  const resPredict = http.post(`${BASE_URL}/api/predict/crop`, payload, params);
  check(resPredict, {
    'Prediction status is 200 or 422': (r) => [200, 422].includes(r.status),
  });

  sleep(1);
}
