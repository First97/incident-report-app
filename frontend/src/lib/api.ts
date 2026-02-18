import { getOwnerId } from "./owner";

const baseUrl = import.meta.env.VITE_API_URL;

export type Category = "Safety" | "Maintenance";
export type Status = "Open" | "In Progress" | "Success";

export type Incident = {
  id: number;
  title: string;
  description: string;
  category: Category;
  status: Status;
  createdAt: string;
  updatedAt: string;
};

export type IncidentInput = {
  title: string;
  description: string;
  category: Category;
  status: Status;
};

async function readError(res: Response) {
  const text = await res.text();
  try {
    const j = JSON.parse(text);
    return j?.error ? String(j.error) : text;
  } catch {
    return text || `HTTP ${res.status}`;
  }
}

export async function listIncidents(): Promise<Incident[]> {
  const res = await fetch(`${baseUrl}/api/incidents`);
  if (!res.ok) throw new Error(await readError(res));
  return res.json();
}

export async function createIncident(input: IncidentInput): Promise<Incident> {
  const res = await fetch(`${baseUrl}/api/incidents`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Owner-Id": getOwnerId(),
    },
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error(await readError(res));
  return res.json();
}

export async function updateIncident(id: number, input: IncidentInput): Promise<Incident> {
  const res = await fetch(`${baseUrl}/api/incidents/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      // จะส่ง X-Owner-Id ด้วยก็ได้ (backend ไม่บังคับตอน PUT)
      "X-Owner-Id": getOwnerId(),
    },
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error(await readError(res));
  return res.json();
}

export async function deleteIncident(id: number): Promise<void> {
  const res = await fetch(`${baseUrl}/api/incidents/${id}`, {
    method: "DELETE",
    headers: { "X-Owner-Id": getOwnerId() },
  });
  if (!res.ok) throw new Error(await readError(res));
}
