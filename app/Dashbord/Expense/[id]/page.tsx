"use client";

import { ArrowLeft, Calendar, Edit, Trash2, BadgeDollarSign } from "lucide-react";
import { api } from "next-laravel-apihelper";
import Link from "next/link";
import { useParams,useRouter } from "next/navigation";
import { useState,useEffect } from "react";
import { formatDistanceToNow } from 'date-fns'
import Swal from "sweetalert2";

/* const handleExportExcel = () => {
  const worksheet = XLSX.utils.json_to_sheet(expenses);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Expenses");
  XLSX.writeFile(workbook, "expense_history.xlsx");
};
 */

export default function SingleExpensePage() {
  const router=useRouter()
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
   const [expense, setExpense] = useState({
      id: 0,
      amount: 0,
      category: "",
      date: "",
      note: "",
      created_at:"",
      isRecurring: false,
      recurringType: "",
    });

      useEffect(() => {
        async function fetchExpense() {
          try {
            const res = await api.get(`/getExpense/${id}`);
            setExpense(res);
            console.log(res);
          } catch (err) {
            console.error("Error fetching expense", err);
          } finally {
            setLoading(false);
          }
        }
    
        if (id) {
          fetchExpense();
        }
      }, [id]);

       const handleDelete = async (id: number) => {
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

          await api.delete(`/deleteExpense/${id}`);
        
          Swal.fire("Deleted!", "Your file has been deleted.", "success");
          router.push("/Dashbord/all-expenses");
            
        };
          })
        };


      if (loading) return <p className="text-white p-4">Loading...</p>;
  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Back Button */}
      <div className="flex items-center gap-3">
        <Link
          href="/Dashbord/all-expenses"
          className="text-white hover:text-indigo-400 transition flex items-center gap-1"
        >
          <ArrowLeft size={18} />
          <span className="text-sm">Back to Expenses</span>
        </Link>
      </div>

      {/* Expense Card */}
      <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 shadow-xl text-white">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Expense Details</h2>
          <div className="flex gap-2">
            <Link
              href={`/Dashbord/edit-expense/${expense.id}`}
              className="flex items-center gap-1 px-3 py-1.5 bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 rounded-md text-sm"
            >
              <Edit size={16} />
              Edit
            </Link>
            <button className="flex items-center gap-1 px-3 py-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-md text-sm" onClick={() => handleDelete(expense.id)}>
              <Trash2 size={16} />
              Delete
            </button>
          </div>
        </div>

        {/* Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <p className="text-sm text-gray-300">Amount</p>
            <h3 className="text-xl font-semibold text-green-400 flex items-center gap-1">
              <BadgeDollarSign size={18} />
             #{ expense.amount.toLocaleString()}
            </h3>
          </div>

          <div className="space-y-2">
            <p className="text-sm text-gray-300">Date</p>
            <p className="text-lg flex items-center gap-1">
              <Calendar size={18} className="text-indigo-300" />
             {formatDistanceToNow(new Date(expense.created_at))} 
            </p>
          </div>

          <div className="space-y-2">
            <p className="text-sm text-gray-300">Category</p>
         {   <p className="text-lg">{expense.category} </p> }
          </div>

          <div className="space-y-2">
  <p className="text-sm text-gray-300">Recurring</p>
  {expense.recurringType ? (
    <span className="inline-block bg-green-400/20 text-green-300 px-3 py-1 rounded-full text-xs">
      {expense.recurringType.charAt(0).toUpperCase() + expense.recurringType.slice(1)} Expense
    </span>
  ) : (
    <span className="text-sm text-gray-400 italic">Not recurring</span>
  )}
</div>

          <div className="space-y-2">
            <p className="text-sm text-gray-300">Tags</p>
           {/*  <div className="flex flex-wrap gap-2">
              {expense.tags?.length > 0 ? (
                expense.tags.map((tag: string, idx: number) => (
                  <span
                    key={idx}
                    className="bg-indigo-400/20 text-indigo-200 px-3 py-1 rounded-full text-xs"
                  >
                    #{tag}
                  </span>
                ))
              ) : (
                <span className="text-sm text-gray-400 italic">No tags</span>
              )}
            </div> */}
          </div>
        </div>

        {/* Notes (optional) */}
        {expense.note && (
          <div className="mt-8">
            <p className="text-sm text-gray-300 mb-1">Notes</p>
            <p className="text-gray-100 bg-white/5 p-4 rounded-lg text-sm">{expense.note}</p>
          </div>
        )}
      </div>
    </div>
  );
}
