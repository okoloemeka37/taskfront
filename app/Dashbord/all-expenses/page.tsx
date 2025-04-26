"use client";

import {
  Download,
  FileText,
  Filter,
  MoreHorizontal,
  Search,
  Pencil,
  Trash2,
} from "lucide-react";
import * as LucideIcons from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { api } from "next-laravel-apihelper";
import Swal from "sweetalert2";
import Link from "next/link";
import { useAuth } from "../../context/AuthContext";


function getLucideIcon(iconName: string): LucideIcon {


  const Icon = LucideIcons[iconName as keyof typeof LucideIcons];
  return Icon as LucideIcon;
}

function ProductIcon({ iconName }: { iconName: string }) {
  const Icon = getLucideIcon(iconName);
  if (!Icon) return null;

  return <Icon className="w-6 h-6 text-amber-300" strokeWidth={1.5} />;
}

export default function AllExpensesPage() {
  const [deleting, setDeleting] = useState(false);

  const {BASE_URL} = useAuth();
  const [totalPage, setTotalPage] = useState(0);
  const [expenses, setExpenses] = useState([
    { id: 0, amount: 0, date: "", category: "", icon: "" ,   isRecurring: false,
      recurringType: "",  },
  ]);
  const [nextPage, setNextPage] = useState(1);
  const [prevPage, setPrevPage] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const filteredExpenses = expenses.filter((exp) =>
    exp.category.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    getExpenses(nextPage);
  }, []);

  async function getExpenses(page: number) {
    const response = await api.get(`/getExpenses?page=${page}`);
    setExpenses(response.data);
    setTotalPage(response.total);
    setNextPage(response.current_page + 1);
    setPrevPage(response.current_page - 1);
     setLoading(false);
  }

  

  const handleDelete = async (id: number) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You will be able to revert this in trash",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          setDeleting(true);
          await api.delete(`/deleteExpense/${id}`);
          await getExpenses(prevPage + 1);
          Swal.fire("Deleted!", "Your Expense has been deleted.", "success");
        } catch (error) {
          Swal.fire("Error", "Something went wrong.", "error");
        } finally {
          setDeleting(false);
        }
      }
    });
  };
  
 if (loading) return <p className="text-white p-4">Loading...</p>;

   
  return (
    <div className="space-y-6">
      {deleting && (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center">
      <div className="border-4 border-t-4 border-white/30 border-t-white rounded-full w-12 h-12 animate-spin" />
    </div>
  )}
      {/* Header & Actions */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <h2 className="text-2xl font-bold text-white">All Expenses</h2>
        <div className="flex gap-2 flex-wrap">
          <button className="flex items-center gap-2 text-sm px-4 py-2 rounded-md bg-white/10 text-white hover:bg-white/20">
            <FileText size={16} /> Export PDF
          </button>
          <button className="flex items-center gap-2 text-sm px-4 py-2 rounded-md bg-white/10 text-white hover:bg-white/20">
            <Download size={16} /> Export CSV
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-1/2">
          <input
            type="text"
            placeholder="Search expenses..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white/10 text-white rounded-lg py-2 px-4 pl-10 placeholder:text-gray-300 focus:outline-none"
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
        </div>
        <button className="flex items-center gap-2 text-sm px-4 py-2 rounded-md bg-white/10 text-white hover:bg-white/20">
          <Filter size={16} /> Filter
        </button>
      </div>

      {/* Expenses Table */}
      <div className="overflow-x-auto bg-white/10 rounded-xl shadow-xl">
        <table className="w-full table-auto text-sm text-white">
          <thead>
            <tr className="bg-white/5">
              <th className="text-left px-6 py-3">Icon</th>
              <th className="text-left px-6 py-3">Amount</th>
              <th className="text-left px-6 py-3">Date</th>
              <th className="text-left px-6 py-3">Category</th>
              <th className="text-left px-6 py-3">Recurring</th>
              <th className="text-right px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredExpenses.map((exp) => (
              <tr key={exp.id} className="border-t border-white/10 hover:bg-white/5 transition">
                <td className="px-6 py-4">
                <Link href={`/Dashbord/Expense/${exp.id}`}> <ProductIcon iconName={"Pizza"} /></Link>
                </td>
                <td className="px-6 py-4">₦{exp.amount.toLocaleString()}</td>
                <td className="px-6 py-4">{exp.date}</td>
                <td className="px-6 py-4">{exp.category}</td>
                <td className="px-6 py-4">
  {exp.isRecurring ? (
    <span className="bg-amber-400/10 text-amber-300 text-xs px-2 py-1 rounded-full">
      {exp.recurringType?.charAt(0).toUpperCase() + exp.recurringType?.slice(1)}
    </span>
  ) : (
    <span className="text-xs text-gray-400">One-time</span>
  )}
</td>

                <td className="px-6 py-4 text-right space-x-2">
                
                <Link href={`/Dashbord/edit-expense/${exp.id}`}>
                  <button className="px-2 py-1 rounded bg-white/10 hover:bg-white/20">
                    <Pencil size={16} />
                  </button>
                  </Link>
                  <button
                    onClick={() => handleDelete(exp.id)}
                    className="px-2 py-1 rounded bg-red-500/20 hover:bg-red-500/40 text-red-300"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="p-4 flex justify-end gap-2 text-sm text-white">
          {prevPage >= 1 && (
            <button
              className="px-3 py-1 rounded bg-white/10 hover:bg-white/20"
              onClick={() => getExpenses(nextPage - 2)}
            >
              Previous
            </button>
          )}
          {nextPage <= totalPage && (
            <button
              className="px-3 py-1 rounded bg-white/10 hover:bg-white/20"
              onClick={() => getExpenses(nextPage)}
            >
              Next
            </button>
          )}
        </div>
        <p className="flex justify-end">showing page {nextPage-1} of {totalPage}</p>
      </div>
    </div>
  );
}
