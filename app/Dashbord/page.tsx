// src/app/dashboard/page.tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { ArrowUpRight, DollarSign, Calendar, TrendingDown,ArrowDownRight } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import { api } from "next-laravel-apihelper";
import { formatDistanceToNow } from 'date-fns'
import Link from "next/link";


export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  interface TallyType {
    total_monthly_expense: number;
    highest_monthly_expense:[{ amount: number ,category: string,created_at:string}]
    total_expenses: number;
    recent_expenses:[{id: number, amount: number, category: string}],
    last_month_expense:number
  }
  
  const [Tally, setTally] = useState<TallyType>({
    total_monthly_expense: 0,
    highest_monthly_expense:[{ amount: 0 ,category: "",created_at: new Date().toString()}],
    total_expenses: 0,
    recent_expenses:[{id: 0, amount: 0, category: ""}],
    last_month_expense:0
  });

  const [ChartData, setChartData] = useState()

  const {userCred}=useAuth()
  useEffect(() => {
   async function getUserExpensesTally() {
    setLoading(true)
     const response=await api.get("/getUserExpensesTally");
   setTally(response.expense);
   console.log(response)
   setLoading(false)
    }

    async function getMonthlyExpensesForChart() {
      setLoading(true)
       const response=await api.get("/getMonthlyExpensesForChart");
     setChartData(response);
     console.log(response);
     setLoading(false)
      }
  
    getMonthlyExpensesForChart()
    getUserExpensesTally()
  }, [])
  
  const percentageChange =
  Tally['last_month_expense'] > 0
    ? ((Tally['total_monthly_expense'] - Tally['last_month_expense']) / Tally.last_month_expense) * 100
    : 0;

    const isPositive = percentageChange >= 0;

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
            <CardTitle className="text-sm font-medium text-gray-300">Total Expenses</CardTitle>
            <DollarSign className="h-5 w-5 text-indigo-400" />
          </CardHeader>
         
          <CardContent>
            <div className="text-2xl font-bold text-white">#{loading?(<div className="w-8 h-8 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>):Tally['total_expenses']}</div>
          
          </CardContent>
        </Card>

        <Card className="bg-white/10 border-white/10 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">This Month</CardTitle>
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
  <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
  <ArrowUpRight className="h-3 w-3" />
  {percentageChange > 1000 ? "Massive increase of " +percentageChange.toFixed(1)+"%"  : `${percentageChange.toFixed(1)}% from last month`}
</p>
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
  ) : Tally?.highest_monthly_expense?.[0]?.created_at ? (
    formatDistanceToNow(new Date(Tally.highest_monthly_expense[0].created_at), { addSuffix: true })
  ) : (
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
