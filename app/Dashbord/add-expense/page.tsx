"use client";

import { useState } from "react";
import { Calendar, ChevronDown, CreditCard, DollarSign, FileText, Save} from "lucide-react";
import { api } from "next-laravel-apihelper";
import SubmitLoaders from "../../components/Loaders";
import { useRouter } from "next/navigation";


export default function AddExpensePage() {
  const router = useRouter();
  const [expense, setExpense] = useState({
    amount: "",
    category: "",
    note: "",
    date: "",
    sus:"",
    isRecurring: false,
    recurringType: "", 
  });
  const [errors, setErrors] = useState({
    amount: "",
    category: "",
    note: "",
    date: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;
    const checked = type === "checkbox" ? (e.target as HTMLInputElement).checked : undefined;
  
    setExpense((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  
    if (name === "category" && value === "Other") {
      setother(true);
    } else if (name === "category") {
      setother(false);
    }
  };
  
const [other, setother] = useState(false)


  // Handle form submission
  const handleSubmit =async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    if (expense.category=='Other') {
      setExpense((prevState) => ({ ...prevState, category: expense.sus }));
      setother(false)
    }
    try {
      const response=await api.post("/addExpense", expense);
     router.push("/Dashbord/all-expenses")
  setLoading(false)
    }catch (error:any) {

      if ( error.response?.data !== undefined) {
         setErrors(error.response?.data.errors)
      setLoading(false)
      }
     
     }
  
  };

  return (
    <div className="max-w-2xl mx-auto bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 space-y-6">
      <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
        <DollarSign size={24} className="text-indigo-400" /> Add New Expense
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Amount */}
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-300">Amount</label>
          <div className="flex items-center bg-white/10 border border-white/20 rounded-lg p-3">
            <DollarSign size={18} className="mr-2 text-indigo-400" />
            <input
              type="number"
              name="amount"
              value={expense.amount}
              onChange={handleChange}
              placeholder="Enter amount"
              
              className="bg-transparent outline-none text-white w-full"
            />
          </div>
          <p className="text-red-400">{errors['amount']}</p>
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
          <p className="text-red-400">{errors['category']}</p>
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
        {/* Date */}
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-300">Date</label>
          <div className="flex items-center bg-white/10 border border-white/20 rounded-lg p-3">
            <Calendar size={18} className="mr-2 text-indigo-400" />
            <input
              type="date"
              name="date"
              value={expense.date}
              onChange={handleChange}
              
              className="bg-transparent outline-none text-white w-full"
            />
          </div>
          <p className="text-red-400">{errors['date']}</p>
        </div>

        {/* Recurring Toggle */}
<div>
  <label className="flex items-center gap-3 text-sm font-medium text-gray-300">
    <input
      type="checkbox"
      name="isRecurring"
      checked={expense.isRecurring}
      onChange={handleChange}
      className="w-4 h-4 text-indigo-600 bg-gray-100 border-gray-300 rounded focus:ring-indigo-500"
    />
    Recurring Expense
  </label>
</div>

{/* Recurring Type - Show only if isRecurring is true */}
{expense.isRecurring && (
  <div>
    <label className="block mb-1 text-sm font-medium text-gray-300">Repeat Every</label>
    <div className="flex items-center bg-white/10 border border-white/20 rounded-lg p-3">
      <select
        name="recurringType"
        value={expense.recurringType}
        onChange={handleChange}
        className="bg-transparent outline-none text-black w-full appearance-none"
      >
        <option value="" className="text-black">Select frequency</option>
        <option value="daily">🗓️ Daily</option>
        <option value="weekly">📅 Weekly</option>
        <option value="monthly">📆 Monthly</option>
      </select>
    </div>
  </div>
)}


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
          <p className="text-red-400">{errors['note']}</p>
        </div>

        {/* Submit */}
       {loading?(<SubmitLoaders/>):(<button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 flex items-center justify-center gap-2"> <Save size={18} />Save Expense </button>)} 
      </form>
    </div>
  );
}
