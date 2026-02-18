import { v4 as uuidv4 } from "uuid";

const KEY = "incident_owner_id";

export function getOwnerId() {
  const existing = localStorage.getItem(KEY);
  if (existing) return existing;

  const next = uuidv4();
  localStorage.setItem(KEY, next);
  return next;
}
