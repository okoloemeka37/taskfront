"use client";

import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/card";
import { useState, useEffect } from "react";
import { PlusCircle } from "lucide-react";
import { api } from "next-laravel-apihelper";

import { v4 as uuidv4 } from 'uuid'
import { useAuth } from "../../context/AuthContext";

export default function WalletPage() {
    const {userCred,User}=useAuth();
  const [balance, setBalance] = useState(userCred.balance);
  const [amountToAdd, setAmountToAdd] = useState("");
const [loading, setloading] = useState(false);
  const [adding, setAdding] = useState(false);

  const reference = uuidv4()
  
  

  const handleAddFunds = async () => {

    setAdding(true);
   setloading(true)
   const res=  await api.post("/AddPayment", { amount: Number(amountToAdd)});
    setAmountToAdd("");

    setBalance(res.balance);
   User(res.user);
    setAdding(false);
    setloading(false)
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-indigo-400">My Wallet</h1>

      <Card className="bg-white/10 border-white/10 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-indigo-300">Wallet Balance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold text-white">#{balance.toLocaleString()}</div>
          <p className="text-sm text-gray-400 mt-2">This is the money used for automating bills.</p>
        </CardContent>
      </Card>

      <Card className="bg-white/10 border-white/10 backdrop-blur-sm">
        <CardHeader className="flex justify-between items-center">
          <CardTitle className="text-indigo-300">Add Funds</CardTitle>
          <PlusCircle className="text-indigo-400 cursor-pointer" onClick={() => setAdding(!adding)} />
        </CardHeader>
        <CardContent>
          {adding && (
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="0"
                value={amountToAdd}
                onChange={(e) => setAmountToAdd(e.target.value)}
                className="bg-transparent border border-gray-600 text-white px-2 py-1 rounded w-full"
                placeholder="Enter amount"
              />
              {loading && <span className="animate-spin w-3 h-3 border-2 border-white border-t-transparent rounded-full" />}
            <p onClick={handleAddFunds}>Pay</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
