"use client";

import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { ArrowUpRight, DollarSign, Calendar, TrendingDown, ArrowDownRight } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import { api } from "next-laravel-apihelper";
import { formatDistanceToNow, differenceInDays,differenceInHours} from 'date-fns';
import Link from "next/link";


export default function DashboardPage() {
 const {BASE_URL,userCred }= useAuth();
  const [loading, setLoading] = useState(true);
  interface TallyType {
    total_monthly_expense: number;
    highest_monthly_expense: [{ amount: number, category: string, created_at: string }];
    recent_expenses: [{ id: number, amount: number, category: string }];

  }

const [editingBudget, setEditingBudget] = useState(false);
const [budgetInput, setBudgetInput] = useState("");
const [isSaving, setIsSaving] = useState(false);


  const [Tally, setTally] = useState<TallyType>({
    total_monthly_expense: 0,
    highest_monthly_expense: [{ amount: 0, category: "", created_at: new Date().toString() }],

    recent_expenses: [{ id: 0, amount: 0, category: "" }],

  });

  const [upcomingCronJobs, setUpcomingCronJobs] = useState<{ id: number, title: string, diff:string, next_run: string }[]>([]);

  const [ChartData, setChartData] = useState();



  useEffect(() => {
    async function getUserExpensesTally() {
      setLoading(true);
      const response = await api.get("/getUserExpensesTally");
      setTally(response.expense);
      console.log(response);
      setLoading(false);
    }

    async function getMonthlyExpensesForChart() {
      setLoading(true);
      const response = await api.get("/getMonthlyExpensesForChart");
      setChartData(response);
      console.log(response);
      setLoading(false);
    }

    async function getUpcomingCronJobs() {
      // Demo data if no API is available
      const response = await api.get("/cron");
      const demoCronJobs = [
        { id: 1, task: "Backup Database", dueDate: "2025-05-01 03:00 AM" },
        { id: 2, task: "System Maintenance", dueDate: "2025-05-02 12:00 AM" },
        { id: 3, task: "Send Monthly Reports", dueDate: "2025-05-05 09:00 AM" },
      ];
      setUpcomingCronJobs(response.data);
      console.log(response.data);
      console.log(demoCronJobs);  // Log the demo cron jobs
    }
    
    
    
    getMonthlyExpensesForChart();
    getUserExpensesTally();
    getUpcomingCronJobs();
  }, []);

  const UpBudget=async () => {
    try {
      setIsSaving(true);
      await api.post('/updateMonthlyBudget', { amount: Number(budgetInput) });
      userCred.budget = budgetInput;
      setEditingBudget(false);
    } catch (err) {
      console.error("Failed to update budget", err);
      // Optionally show a toast
    } finally {
      setIsSaving(false);
    }
  }
 
      return (
        <div className="space-y-8">
    
          {/* Top Title */}
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-indigo-400">Welcome back 👋 {userCred['name']}</h1>
            <p className="text-gray-400 mt-2">Here’s what’s happening with your expenses.</p>
          </div>
    
          {/* Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

           <Card className="bg-white/10 border-white/10 backdrop-blur-sm">
  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
    <CardTitle className="text-sm font-medium text-gray-300">Wallet Balance</CardTitle>
    <ArrowUpRight className="h-5 w-5 text-indigo-400" />
  </CardHeader>

  <CardContent>
    <div className="text-2xl font-bold text-white">
      {loading ? (
        <div className="w-8 h-8 border-4 border-indigo-400 border-dashed rounded-full animate-spin"></div>
      ) : (
        userCred?.balance !== undefined
          ? `#${Number(userCred.balance).toLocaleString()}`
          : <span className="text-sm text-gray-400">No balance info</span>
      )}
    </div>
    <p className="text-xs text-gray-400 mt-1">This is your available wallet balance</p>
  </CardContent>
</Card>
 
            <Card className="bg-white/10 border-white/10 backdrop-blur-sm">
  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
    <CardTitle className="text-sm font-medium text-gray-300">Budget</CardTitle>
    <DollarSign className="h-5 w-5 text-indigo-400" />
  </CardHeader>

  <CardContent>
  {editingBudget ? (
    <div className="flex gap-2 items-center">
      <input
        type="number"
        min="0"
        className="bg-transparent border border-gray-500 rounded px-2 py-1 text-white w-full"
        value={budgetInput}
        onChange={(e) => setBudgetInput(e.target.value)}
        placeholder="Enter amount"
      />
      <button
        className="text-xs text-indigo-400 font-semibold disabled:opacity-50 flex items-center gap-1"  disabled={!budgetInput || isNaN(Number(budgetInput)) || isSaving}onClick={UpBudget}>
        {isSaving && <span className="animate-spin w-3 h-3 border-2 border-white border-t-transparent rounded-full" />}
        Save
      </button>
    </div>
  ) : (
    <div
      className="text-2xl font-bold text-white cursor-pointer hover:opacity-80 transition"
      onClick={() => {
        setBudgetInput(userCred?.budget || "");
        setEditingBudget(true);
      }}
    >
      {userCred?.budget
        ? `#${Number(userCred.budget).toLocaleString()}`
        : <span className="text-sm text-gray-400">Click to set budget</span>}
    </div>
  )}
  <p className="text-xs text-gray-400 mt-1">Track your spending goal this month</p>
</CardContent>

            </Card> 
            <Card className="bg-white/10 border-white/10 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-300">Monthly Expense</CardTitle>
                <Calendar className="h-5 w-5 text-indigo-400" />
              </CardHeader>
            
              <CardContent>
      <div className="text-2xl font-bold text-white">
        {loading ? (
          <div className="w-8 h-8 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
        ) : (
          `#${Tally.total_monthly_expense.toLocaleString()}`
        )}
      </div>
     
    </CardContent>
            </Card>
    
            <Card className="bg-white/10 border-white/10 backdrop-blur-sm">
  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
    <CardTitle className="text-sm font-medium text-gray-300">Remaining Budget</CardTitle>
    <DollarSign className="h-5 w-5 text-indigo-400" />
  </CardHeader>
  <CardContent>
    {userCred?.budget ? (() => {
      const remaining = Number(userCred.budget) - Tally.total_monthly_expense;
      const isOverspent = remaining < 0;

      return (
        <>
          <div
            className={`text-2xl font-bold ${
              isOverspent ? 'text-red-400' : 'text-green-400'
            }`}
          >
            {isOverspent ? `-#${Math.abs(remaining).toLocaleString()}` : `#${remaining.toLocaleString()}`}
          </div>
          <p className="text-xs text-gray-400 mt-1">
            {isOverspent
              ? 'You have exceeded your monthly budget'
              : 'Based on current spending'}
          </p>
        </>
      );
    })() : (
      <div className="text-sm text-gray-400">No budget set</div>
    )}
  </CardContent>
            </Card>

    
          
            <Card className="bg-white/10 border-white/10 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-300">Biggest Expense</CardTitle>
                <DollarSign className="h-5 w-5 text-indigo-400" />
              </CardHeader>
              <CardContent>
              <div className="text-xs text-gray-400 mt-1">
      {loading ? (
        <p className="w-8 h-8 border-4 border-blue-500 border-dashed rounded-full animate-spin"></p>
      ) : Tally?.highest_monthly_expense?.[0]?.amount ? (<p className="text-2xl font-bold text-white">#{Tally.highest_monthly_expense[0].amount}</p>) : (
        "No data available"
      )}
    </div>
                <div className="text-xs text-gray-400 mt-1">
      {loading ? (
        <p className="w-8 h-8 border-4 border-blue-500 border-dashed rounded-full animate-spin"></p>
      ) : Tally?.highest_monthly_expense?.[0]?.created_at ? (
        formatDistanceToNow(new Date(Tally.highest_monthly_expense[0].created_at), { addSuffix: true })
      ) : (
        "No data available"
      )}
                </div>
              </CardContent>
   

            </Card>

           

          </div>
    
                {/* Upcoming Cron Jobs Section */}
          <div className="bg-white/10 border-white/10 backdrop-blur-sm p-6 rounded-xl">
          <h2 className="text-lg font-semibold text-indigo-400 mb-4"><Link href={BASE_URL+"Dashbord/Scheduler"}>Scheduled Tasks</Link></h2>
          {loading ? (
            <div className="w-8 h-8 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
          ) : (
            <ul className="divide-y divide-white/10">
              {upcomingCronJobs.length > 0 ? (
                upcomingCronJobs.map((job, index) => (
                  <li key={index} className="py-4 flex justify-between">
                    <span className="text-gray-300">{job.title}</span>
                    <span className="text-white font-semibold">{job.next_run}</span>
                    <span className="text-white font-semibold">{job.diff}</span>
                  </li>
                ))
              ) : (
                <li className="py-4 text-gray-400">No upcoming cron jobs.</li>
              )}
            </ul>
          )}
        </div>


          {/* Expenses Overview Chart */}
          <div className="bg-white/10 border-white/10 backdrop-blur-sm p-6 rounded-xl">
            <h2 className="text-lg font-semibold text-indigo-400 mb-4">Expenses Overview</h2>
           {loading?(<div className="w-8 h-8 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>):(
             <ResponsiveContainer width="100%" height={300}>
             <BarChart data={ChartData}>
               <XAxis dataKey="name" stroke="#94a3b8" />
               <YAxis stroke="#94a3b8" />
               <Tooltip contentStyle={{ backgroundColor: "#1e293b", borderColor: "#64748b" }} />
               <Bar dataKey="expenses" fill="#6366f1" radius={[8, 8, 0, 0]} />
             </BarChart>
           </ResponsiveContainer>
           )}
          </div>
    
          {/* Recent Expenses List */}
          <div className="bg-white/10 border-white/10 backdrop-blur-sm p-6 rounded-xl">
            <h2 className="text-lg font-semibold text-indigo-400 mb-4">Recent Expenses</h2>
            <ul className="divide-y divide-white/10">
              {loading?(<div className="w-8 h-8 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>):(
                Tally['recent_expenses'].map((recent,index)=>(
              <li className="py-4 flex justify-between" key={index}>
    
               <Link href={`/Dashbord/Expense/${recent.id}`}> <span className="text-gray-300">{recent['category']}</span></Link>
                <span className="text-white font-semibold">#{recent['amount']}</span>
              </li>
                ))
              )}
          
            </ul>
          </div>
    
   
        </div>
      );
}





  