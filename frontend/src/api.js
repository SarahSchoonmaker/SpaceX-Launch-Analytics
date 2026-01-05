const API_BASE = "http://localhost:8000";

export async function ingestLaunches(limit = 120) {
  const res = await fetch(`${API_BASE}/api/ingest/launches?limit=${limit}`, {
    method: "POST",
  });
  if (!res.ok) throw new Error("Failed to ingest launches");
  return res.json();
}

export async function fetchLaunches(limit = 50) {
  const res = await fetch(`${API_BASE}/api/launches?limit=${limit}`);
  if (!res.ok) throw new Error("Failed to fetch launches");
  return res.json();
}

export async function fetchMetrics() {
  const res = await fetch(`${API_BASE}/api/metrics`);
  if (!res.ok) throw new Error("Failed to fetch metrics");
  return res.json();
}

export async function fetchBrief() {
  const res = await fetch(`${API_BASE}/api/brief`);
  if (!res.ok) throw new Error("Failed to fetch brief");
  return res.json();
}
