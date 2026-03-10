# TransGAN-IDS Dashboard — Data API Reference

This document describes the data structures the dashboard expects. Replace the simulated data in `src/utils/dataSimulator.js` with real API calls to connect to your backend.

---

## 1. Live Packet Data (Real-Time Traffic)

**Endpoint:** `GET /api/packets/stream` (WebSocket or SSE recommended)

Each packet object:

```json
{
  "flowId": "FL-1001",
  "timestamp": "22:32:41",
  "featureVectorSize": 78,
  "anomalyScore": 0.832,
  "sourceIP": "192.168.1.45",
  "attackType": "DDoS",
  "status": "Attack"
}
```

| Field | Type | Description |
|---|---|---|
| `flowId` | string | Unique flow identifier |
| `timestamp` | string | Time of packet capture |
| `featureVectorSize` | number | Number of features extracted (e.g. 78) |
| `anomalyScore` | float | 0.0 – 1.0, scores > 0.75 trigger alerts |
| `sourceIP` | string | Source IP address |
| `attackType` | string | `Normal`, `DDoS`, `Port Scan`, `Brute Force`, `SQL Injection`, `XSS`, `Malware`, `Phishing` |
| `status` | string | `Normal` or `Attack` |

---

## 2. Model Performance Metrics

**Endpoint:** `GET /api/model/metrics`

```json
{
  "accuracy": 0.9847,
  "precision": 0.9812,
  "recall": 0.9789,
  "f1": 0.9800,
  "falseOmissionRate": 0.0211,
  "auc": 0.9923
}
```

---

## 3. Confusion Matrix

**Endpoint:** `GET /api/model/confusion-matrix`

```json
{
  "truePositive": 4823,
  "falsePositive": 91,
  "falseNegative": 102,
  "trueNegative": 4984
}
```

---

## 4. ROC Curve Data

**Endpoint:** `GET /api/model/roc`

Array of `{ fpr, tpr }` points:

```json
[
  { "fpr": 0.0, "tpr": 0.0 },
  { "fpr": 0.01, "tpr": 0.45 },
  { "fpr": 0.05, "tpr": 0.82 },
  { "fpr": 0.10, "tpr": 0.92 },
  { "fpr": 1.0, "tpr": 1.0 }
]
```

---

## 5. Benchmark Comparison

**Endpoint:** `GET /api/model/benchmark`

```json
[
  { "metric": "Accuracy", "baseline": 0.9512, "model": 0.9847 },
  { "metric": "Precision", "baseline": 0.9423, "model": 0.9812 },
  { "metric": "Recall", "baseline": 0.9356, "model": 0.9789 },
  { "metric": "F1 Score", "baseline": 0.9389, "model": 0.9800 },
  { "metric": "FOR", "baseline": 0.0644, "model": 0.0211 },
  { "metric": "AUC-ROC", "baseline": 0.9678, "model": 0.9923 }
]
```

---

## How to Connect

Replace `generatePacket()` in `LiveMonitor.jsx` with a fetch/WebSocket call:

```jsx
// Example: replace setInterval in LiveMonitor.jsx
useEffect(() => {
  const ws = new WebSocket('ws://your-backend/api/packets/stream');
  ws.onmessage = (event) => {
    const packet = JSON.parse(event.data);
    setPackets((prev) => [packet, ...prev].slice(0, 5));
    // ... rest of the logic
  };
  return () => ws.close();
}, []);
```

For static endpoints (metrics, confusion matrix, benchmark), use `fetch()` in a `useEffect` on page mount.
