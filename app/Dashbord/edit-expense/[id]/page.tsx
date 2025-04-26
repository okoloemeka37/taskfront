// app/dashboard/all-expenses/edit-expense/[id]/page.tsx
"use client";
import { Calendar, ChevronDown, CreditCard, DollarSign, FileText, Save } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "next-laravel-apihelper";
import Swal from "sweetalert2";

export default function EditExpensePage() {
  const { id } = useParams();
  const router = useRouter();
  const [other, setother] = useState(false)

  const [loading, setLoading] = useState(true);
  const [expense, setExpense] = useState({
    amount: 0,
    category: "",
    date: "",
    note: "",
    sus:""
  });

  useEffect(() => {
    async function fetchExpense() {
      try {
        const res = await api.get(`/getExpense/${id}`);
        setExpense(res);
    
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setExpense((prev) => ({ ...prev, [name]: value }));

    if (e.target.name === "category" && e.target.value === "Other") {
      setother(true);
    } else if (e.target.name === "category") {
      setother(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (expense.category=='Other') {
        setExpense((prevState) => ({ ...prevState, category: expense.sus }));
        setother(false)
        console.log(expense)
      }
      await api.put(`/updateExpense/${id}`, expense);
     
     Swal.fire({
        title: "Success!",
        text: "Expense updated successfully!",
        icon: "success",
        confirmButtonText: "OK",
      }).then(() => {
       router.push("/dashboard/all-expenses");
       })
      
    } catch (error) {
      console.error("Error updating", error);
    }
  };

  if (loading) return <p className="text-white p-4">Loading...</p>;

  return (
 <div className="max-w-2xl mx-auto bg-white/10 rounded-xl p-6 shadow-lg text-white">
      <h2 className="text-2xl font-bold mb-4"> <DollarSign size={24} className="text-indigo-400" /> Edit Expense</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
        <DollarSign size={18} className="mr-2 text-indigo-400" />
          <label className="block mb-1">Amount</label>
          <input
            type="number"
            name="amount"
            value={expense.amount}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-md bg-white/20 border border-white/20 focus:outline-none"
            required
          />
        </div>

        {/* Category */}
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-300">Category</label>
          <div className="flex items-center bg-white/10 border border-white/20 rounded-lg p-3">
            <CreditCard size={18} className="mr-2 text-indigo-400" />
            <select
              name="category"
              value={expense.category}
              onChange={handleChange}
              
              className="bg-transparent outline-none text-black w-full appearance-none"
            >
              <option value="">Select a category</option>
              <option value="Food">🍔 Food</option>
              <option value="Transport">🚕 Transport</option>
              <option value="Shopping">🛍️ Shopping</option>
              <option value="Bills">💡 Bills</option>
              <option value="Other">📦 Other</option>
            </select>
            <ChevronDown size={18} className="ml-auto text-gray-400" />
          </div>
        </div>
    {other && (    <div>
       
       <div className="flex items-center bg-white/10 border border-white/20 rounded-lg p-3">
       <CreditCard size={18} className="mr-2 text-indigo-400" />
         <input
           type="text"
           name="sus"
           value={expense.sus}
           onChange={handleChange}
           placeholder="Enter category"
           
           className="bg-transparent outline-none text-white w-full"
         />
       </div>
     </div>)}

        <div>
          <label className="block mb-1"><Calendar size={18} className="mr-2 text-indigo-400" />Date</label>
          <input
            type="date"
            name="date"
            value={expense.date}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-md bg-white/20 border border-white/20 focus:outline-none"
            required
          />
        </div>

  {/* Note */}
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-300">Note (optional)</label>
          <div className="flex items-start bg-white/10 border border-white/20 rounded-lg p-3">
            <FileText size={18} className="mr-2 mt-1 text-indigo-400" />
            <textarea
              name="note"
              value={expense.note}
              onChange={handleChange}
              placeholder="Add a short note..."
              rows={3}
              className="bg-transparent outline-none text-white w-full resize-none"
            />
          </div>
        </div>
        

        <button
          type="submit"
          className="bg-indigo-500 hover:bg-indigo-600 px-4 py-2 rounded-md text-white font-medium"
        >
          Update Expense
        </button>
      </form>
    </div> 
  
  );
}
