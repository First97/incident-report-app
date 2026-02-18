import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Incident, IncidentInput } from "./lib/api";
import { listIncidents, createIncident, updateIncident, deleteIncident } from "./lib/api";
import Modal from "./components/Modal";
import IncidentForm from "./components/IncidentForm";

export default function App() {
  const qc = useQueryClient();

  const [openCreate, setOpenCreate] = useState(false);
  const [editing, setEditing] = useState<Incident | null>(null);
  const [deleting, setDeleting] = useState<Incident | null>(null);

  const [filterCategory, setFilterCategory] = useState<string>("All");
  const [filterStatus, setFilterStatus] = useState<string>("All");
  const [search, setSearch] = useState("");

  const incidentsQ = useQuery({
    queryKey: ["incidents"],
    queryFn: listIncidents,
  });

  const createM = useMutation({
    mutationFn: (data: IncidentInput) => createIncident(data),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["incidents"] });
      setOpenCreate(false);
    },
  });

  const updateM = useMutation({
    mutationFn: ({ id, data }: { id: number; data: IncidentInput }) => updateIncident(id, data),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["incidents"] });
      setEditing(null);
    },
  });

  const deleteM = useMutation({
    mutationFn: (id: number) => deleteIncident(id),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["incidents"] });
      setDeleting(null);
    },
  });

  const filtered = useMemo(() => {
    const items = incidentsQ.data ?? [];
    return items.filter((it) => {
      const okCat = filterCategory === "All" || it.category === filterCategory;
      const okSt = filterStatus === "All" || it.status === filterStatus;
      const okSearch =
        search.trim() === "" ||
        it.title.toLowerCase().includes(search.trim().toLowerCase());
      return okCat && okSt && okSearch;
    });
  }, [incidentsQ.data, filterCategory, filterStatus, search]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-5xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Incident Report App</h1>
            <p className="text-sm text-gray-600">Create • View • Edit • Delete (own)</p>
          </div>
          <button
            onClick={() => setOpenCreate(true)}
            className="rounded-2xl bg-black px-4 py-2 text-sm font-medium text-white"
          >
            + New Incident
          </button>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-3 rounded-2xl bg-white p-4 shadow-sm md:grid-cols-3">
          <input
            className="rounded-xl border px-3 py-2 outline-none focus:ring"
            placeholder="Search title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            className="rounded-xl border px-3 py-2 outline-none focus:ring"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            <option value="All">All categories</option>
            <option value="Safety">Safety</option>
            <option value="Maintenance">Maintenance</option>
          </select>

          <select
            className="rounded-xl border px-3 py-2 outline-none focus:ring"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="All">All statuses</option>
            <option value="Open">Open</option>
            <option value="In Progress">In Progress</option>
            <option value="Success">Success</option>
          </select>
        </div>

        <div className="mt-5 rounded-2xl bg-white shadow-sm">
          <div className="border-b p-4">
            <div className="text-sm text-gray-600">
              Total: <span className="font-medium text-gray-900">{filtered.length}</span>
            </div>
          </div>

          {incidentsQ.isLoading ? (
            <div className="p-6 text-gray-600">Loading...</div>
          ) : incidentsQ.isError ? (
            <div className="p-6 text-red-700">
              Error: {(incidentsQ.error as Error).message}
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-10 text-center text-gray-600">
              ยังไม่มี incident — ลองกด “New Incident”
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="text-gray-600">
                  <tr className="border-b">
                    <th className="p-4">Title</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Created</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((it) => (
                    <tr key={it.id} className="border-b last:border-b-0">
                      <td className="p-4">
                        <div className="font-medium">{it.title}</div>
                        <div className="mt-1 text-gray-600">{it.description}</div>
                      </td>
                      <td className="p-4">{it.category}</td>
                      <td className="p-4">{it.status}</td>
                      <td className="p-4">{new Date(it.createdAt).toLocaleString()}</td>
                      <td className="p-4">
                        <div className="flex justify-end gap-2">
                          <button
                            className="rounded-xl border px-3 py-1.5 hover:bg-gray-50"
                            onClick={() => setEditing(it)}
                          >
                            Edit
                          </button>
                          <button
                            className="rounded-xl border border-red-200 bg-red-50 px-3 py-1.5 text-red-700 hover:bg-red-100"
                            onClick={() => setDeleting(it)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <Modal open={openCreate} title="New Incident" onClose={() => setOpenCreate(false)}>
        <IncidentForm
          submitting={createM.isPending}
          serverError={createM.isError ? (createM.error as Error).message : null}
          onSubmit={(data) => createM.mutate(data)}
        />
      </Modal>

      <Modal
        open={!!editing}
        title="Edit Incident"
        onClose={() => (updateM.isPending ? null : setEditing(null))}
      >
        {editing ? (
          <IncidentForm
            initial={editing}
            submitting={updateM.isPending}
            serverError={updateM.isError ? (updateM.error as Error).message : null}
            onSubmit={(data) => updateM.mutate({ id: editing.id, data })}
          />
        ) : null}
      </Modal>

      <Modal
        open={!!deleting}
        title="Confirm delete"
        onClose={() => (deleteM.isPending ? null : setDeleting(null))}
      >
        {deleting ? (
          <div className="space-y-3">
            <p className="text-sm text-gray-700">
              ลบ <span className="font-medium">{deleting.title}</span> ?
            </p>
            {deleteM.isError ? (
              <div className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">
                {(deleteM.error as Error).message}
              </div>
            ) : null}
            <div className="flex justify-end gap-2">
              <button
                className="rounded-xl border px-4 py-2 text-sm hover:bg-gray-50"
                onClick={() => setDeleting(null)}
                disabled={deleteM.isPending}
              >
                Cancel
              </button>
              <button
                className="rounded-xl bg-red-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
                onClick={() => deleteM.mutate(deleting.id)}
                disabled={deleteM.isPending}
              >
                {deleteM.isPending ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        ) : null}
      </Modal>
    </div>
  );
}
