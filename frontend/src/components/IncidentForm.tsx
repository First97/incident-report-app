import { z } from "zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Incident } from "../lib/api";

const schema = z.object({
  title: z.string().min(3, "Title ต้องยาวอย่างน้อย 3 ตัวอักษร"),
  description: z.string().max(2000),
  category: z.enum(["Safety", "Maintenance"]),
  status: z.enum(["Open", "In Progress", "Success"]),
});

type FormValues = z.infer<typeof schema>;

type Props = {
  initial?: Incident;
  onSubmit: (data: FormValues) => void;
  submitting: boolean;
  serverError?: string | null;
};

export default function IncidentForm({
  initial,
  onSubmit,
  submitting,
  serverError,
}: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: "",
      description: "",
      category: "Safety",
      status: "Open",
    },
  });

  useEffect(() => {
    if (initial) {
      reset({
        title: initial.title,
        description: initial.description ?? "",
        category: initial.category,
        status: initial.status,
      });
    } else {
      reset({
        title: "",
        description: "",
        category: "Safety",
        status: "Open",
      });
    }
  }, [initial, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
      {serverError ? (
        <div className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">
          {serverError}
        </div>
      ) : null}

      <div>
        <label className="text-sm font-medium">Title</label>
        <input
          className="mt-1 w-full rounded-xl border px-3 py-2 outline-none focus:ring"
          {...register("title")}
        />
        {errors.title ? (
          <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
        ) : null}
      </div>

      <div>
        <label className="text-sm font-medium">Description</label>
        <textarea
          className="mt-1 w-full rounded-xl border px-3 py-2 outline-none focus:ring"
          rows={4}
          {...register("description")}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-sm font-medium">Category</label>
          <select
            className="mt-1 w-full rounded-xl border px-3 py-2 outline-none focus:ring"
            {...register("category")}
          >
            <option value="Safety">Safety</option>
            <option value="Maintenance">Maintenance</option>
          </select>
        </div>

        <div>
          <label className="text-sm font-medium">Status</label>
          <select
            className="mt-1 w-full rounded-xl border px-3 py-2 outline-none focus:ring"
            {...register("status")}
          >
            <option value="Open">Open</option>
            <option value="In Progress">In Progress</option>
            <option value="Success">Success</option>
          </select>
        </div>
      </div>

      {initial ? (
        <div className="rounded-xl bg-gray-50 p-3 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Created At</span>
            <span>{new Date(initial.createdAt).toLocaleString()}</span>
          </div>
          <div className="mt-1 flex justify-between">
            <span className="text-gray-600">Updated At</span>
            <span>{new Date(initial.updatedAt).toLocaleString()}</span>
          </div>
        </div>
      ) : null}

      <div className="flex justify-end gap-2 pt-2">
        <button
          type="submit"
          disabled={submitting}
          className="rounded-xl bg-black px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
        >
          {submitting ? "Saving..." : "Save"}
        </button>
      </div>
    </form>
  );
}