"use client";

import {
  RotateCcw,
  Trash2,
  Search,
  Loader2,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { api } from "next-laravel-apihelper";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import Swal from "sweetalert2";
import { formatDistanceToNow } from "date-fns";

export default function TrashPage() {
  const [trashedExpenses, setTrashedExpenses] = useState([
    {
      id: 0,
      category: "",
      amount: 0,
      deleted_at: "",
    },
  ]);
  const [loading, setLoading] = useState(false); // Updated to handle loading state for multiple actions
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<number[]>([]);

  useEffect(() => {
    async function getTrashed() {
      try {
        setLoading(true); // Set loading true when fetching
        const response = await api.get("/getTrashed");
        if (response.status === 200) {
          const data = response.expense;
          setLoading(false); // Set loading false when data is fetched
          setTrashedExpenses(data);
        } else {
          toast.error("Failed to fetch trashed expenses.");
          setLoading(false);
        }
      } catch (error) {
        toast.error("Failed to fetch trashed expenses.");
        setLoading(false);
      }
    }
    getTrashed();
  }, []);

  const filtered = trashedExpenses.filter((item) =>
    item.category.toLowerCase().includes(search.toLowerCase())
  );

  const toggleSelect = (id: number) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const restoreItem = async (id: number) => {
    const selected: number[] = [id];
    setLoading(true); // Set loading true while restoring
    const response = await api.post("/restoreExpense", { selected });
    if (response.status === 200) {
      const data = response.expense;
      setLoading(false); // Set loading false after restoring
      setTrashedExpenses(data);
      Swal.fire("Restored!", "Your Expense has been Restored.", "success");
    }
  };

  const deleteItem = (id: number) => {
    const selected: number[] = [id];
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        setLoading(true); // Set loading true while deleting
        const response = await api.post("/permDelExpense", { selected });
        if (response.status === 200) {
          const data = response.expense;
          setLoading(false); // Set loading false after deletion
          setTrashedExpenses(data);
          Swal.fire("Gone Forever!", "Your Expense has been Deleted Permanently.", "success");
        }
      }
    });
  };

  const restoreAll = async () => {
    const selected: number[] = [];
    trashedExpenses.forEach((rt) => {
      selected.push(rt.id);
    });
    setLoading(true); // Set loading true while restoring all
    const response = await api.post("/restoreExpense", { selected });
    if (response.status === 200) {
      const data = response.expense;
      setLoading(false); // Set loading false after restoring all
      setTrashedExpenses(data);
      Swal.fire("Restored!", "Your Expense has been Restored.", "success");
    }
  };

  const deleteAll = () => {
    const selected: number[] = [];
    trashedExpenses.forEach((rt) => {
      selected.push(rt.id);
    });
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        setLoading(true); // Set loading true while deleting all
        const response = await api.post("/permDelExpense", { selected });
        if (response.status === 200) {
          const data = response.expense;
          setLoading(false); // Set loading false after deleting all
          setTrashedExpenses(data);
          Swal.fire("Gone Forever!", "Your Expense has been Deleted Permanently.", "success");
        }
      }
    });
  };

  const restoreSelected = async () => {
    setLoading(true); // Set loading true while restoring selected
    const response = await api.post("/restoreExpense", { selected });
    if (response.status === 200) {
      const data = response.expense;
      setLoading(false); // Set loading false after restoring selected
      setTrashedExpenses(data);
      Swal.fire("Restored!", "Your Expense has been Restored.", "success");
    }
  };

  const deleteSelected = async () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        setLoading(true); // Set loading true while deleting selected
        const response = await api.post("/permDelExpense", { selected });
        if (response.status === 200) {
          const data = response.expense;
          setLoading(false); // Set loading false after deleting selected
          setTrashedExpenses(data);
          Swal.fire("Gone Forever!", "Your Expense has been Deleted Permanently.", "success");
        }
      }
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <h2 className="text-3xl font-bold text-white">🗑️ Trashed Expenses</h2>
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            placeholder="Search trashed..."
            className="w-full py-2 pl-10 pr-4 bg-white/10 text-white rounded-lg placeholder:text-gray-400 focus:outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Search size={18} className="absolute left-3 top-2.5 text-gray-400" />
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 flex-wrap">
        <button
          className="px-4 py-2 bg-indigo-500/20 text-indigo-300 rounded hover:bg-indigo-500/30 transition"
          onClick={restoreAll}
        >
          <RotateCcw className="inline mr-2" size={16} />
          Restore All
        </button>
        <button
          className="px-4 py-2 bg-red-500/20 text-red-300 rounded hover:bg-red-500/30 transition"
          onClick={deleteAll}
        >
          <Trash2 className="inline mr-2" size={16} />
          Delete All
        </button>

        {selected.length > 0 && (
          <>
            <button
              className="px-4 py-2 bg-green-500/20 text-green-300 rounded hover:bg-green-500/30 transition"
              onClick={restoreSelected}
            >
              <CheckCircle2 className="inline mr-2" size={16} />
              Restore Selected ({selected.length})
            </button>
            <button
              className="px-4 py-2 bg-red-600/20 text-red-400 rounded hover:bg-red-600/30 transition"
              onClick={deleteSelected}
            >
              <XCircle className="inline mr-2" size={16} />
              Delete Selected ({selected.length})
            </button>
          </>
        )}
      </div>

      {/* Loader Overlay */}
      
         {loading && (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center">
      <div className="border-4 border-t-4 border-white/30 border-t-white rounded-full w-12 h-12 animate-spin" />
    </div>
  )}

      {/* Table */}
      <div className="overflow-x-auto rounded-xl shadow-xl bg-white/10 backdrop-blur-md">
        <table className="w-full table-auto text-sm text-white">
        <thead className="bg-white/5 text-gray-300 text-xs uppercase">
  <tr>
    <th className="px-4 py-2 text-center w-10">
      <input
        type="checkbox"
        onChange={() =>
          setSelected(
            selected.length === filtered.length
              ? []
              : filtered.map((item) => item.id)
          )
        }
        checked={selected.length === filtered.length}
      />
    </th>
    <th className="px-4 py-2 text-left">Category</th>
    <th className="px-4 py-2 text-left">Amount</th>
    <th className="px-4 py-2 text-left">Deleted At</th>
    <th className="px-4 py-2 text-center">Actions</th>
  </tr>
</thead>

<tbody className="text-sm text-white">
  {filtered.map((item) => (
    <tr key={item.id} className="odd:bg-white/5 even:bg-white/10">
      <td className="px-4 py-2 text-center w-10">
        <input
          type="checkbox"
          checked={selected.includes(item.id)}
          onChange={() => toggleSelect(item.id)}
        />
      </td>
      <td className="px-4 py-2 text-left">{item.category}</td>
      <td className="px-4 py-2 text-left">{item.amount}</td>
      <td className="px-4 py-2 text-left">
        {item.deleted_at && !isNaN(new Date(item.deleted_at).getTime())
          ? formatDistanceToNow(new Date(item.deleted_at))
          : "Invalid date"}
      </td>
      <td className="px-4 py-2 text-center">
        <button
          className="mr-2 text-indigo-300 hover:text-indigo-500"
          onClick={() => restoreItem(item.id)}
        >
          <RotateCcw size={18} />
        </button>
        <button
          className="text-red-300 hover:text-red-500"
          onClick={() => deleteItem(item.id)}
        >
          <Trash2 size={18} />
        </button>
      </td>
    </tr>
  ))}
</tbody>

        </table>
      </div>
    </div>
  );
}
