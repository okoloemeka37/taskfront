"use client";

import { Menu, X, Home, PlusCircle, List, User, LogOut,Trash,History,Wallet } from "lucide-react";

import Link from "next/link";
import { useRouter } from "next/navigation";    
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import DropdownMenuPicture from "../components/DropdownMenuPicture";
import { api } from "next-laravel-apihelper";


export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const {BASE_URL,userCred,logout}=useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  const links = [
    { href: "/Dashbord", label: "Dashboard", icon: <Home size={18} /> },
    { href: "/Dashbord/Wallet", label: "Wallet", icon: <Wallet className="h-4 w-4" /> },
    { href: "/Dashbord/add-expense", label: "Add Expense", icon: <PlusCircle size={18} /> },
    { href: "/Dashbord/all-expenses", label: "All Expenses", icon: <List size={18} /> },
    { href: "/Dashbord/profile", label: "Profile", icon: <User size={18} /> },
    { href: "/Dashbord/trash", label: "Trash", icon: <Trash size={18} /> },
    { href: "/Dashbord/history", label: "History", icon: <History size={18} /> },
     
    
  ];

const [loading, setloading] = useState(false)
  
const Logo = () => {
  setloading(true)
  const resp=api.post("/logout")
  .then((response) => 
    {

  logout()
  router.push("/Auth/Login")
  setloading(false)
    }).catch((error) => {
   
      setloading(false)
    })
  
}
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#0f172a] to-[#1e293b] text-white font-sans">
      
      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 z-40 w-64 bg-white/10 backdrop-blur-lg border-r border-white/10 p-6 shadow-lg transition-transform duration-300 md:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:relative`}>
        
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <h1 className="text-2xl font-extrabold text-indigo-400">ExpenseX</h1>
          <button onClick={() => setSidebarOpen(false)} className="md:hidden">
            <X size={24} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-2">
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-sm font-medium cursor-pointer ${
                  isActive
                    ? "bg-indigo-500 text-white shadow-lg"
                    : "text-gray-300 hover:text-white hover:bg-white/10"
                }`}
              >
                {link.icon}
                {link.label}
              </Link>
            );
          })}

           {/* Logout Button */}
           {loading?( <p className="w-8 h-8 border-4 border-blue-500 border-dashed rounded-full animate-spin"></p>):(     <button className="flex items-center gap-3 hover:text-indigo-600 transition text-sm font-medium text-white bottom-0 mt-auto" onClick={Logo}>
          <LogOut size={18} /> {/* Icon for Logout */}
          Logout
        </button>)}
   
        </nav>
      </aside>

      {/* Main content area */}
      <div className="flex flex-col flex-1">
        

{/* Topbar */}
<header className="flex items-center justify-between px-6 md:px-10 py-6 md:py-8 border-b border-white/10 bg-white/5 backdrop-blur-md shadow-md h-[80px] md:h-[100px]">
  <button onClick={() => setSidebarOpen(true)} className="md:hidden text-gray-300">
    <Menu size={26} />
  </button>
  <h2 className="text-xl md:text-2xl font-semibold">Welcome Back 👋 {userCred['name']}</h2>
  <div>

<DropdownMenuPicture/>

  </div>
</header>

        {/* Page content */}
        <main className="flex-1 px-4 md:px-8 py-6">
          <div className="bg-white/10 rounded-xl p-6 shadow-xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
