"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";
import { api } from "next-laravel-apihelper";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/navigation";
import SubmitLoaders from "../../components/Loaders";

export default function LoginPage() {
const router=useRouter()
  const { login,token,BASE_URL } = useAuth();
  useEffect(() => {
    if (token !=='') {
      router.push(BASE_URL+'/Dashbord/User')
    }

  }, [token,BASE_URL,router])
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
const [Gen, setGen] = useState('')
  const [errors, setErrors] = useState({
    email:'',
    password:'',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit =async (e: React.FormEvent) => {
    e.preventDefault();
  setLoading(true)
    
  try {
  const response = await api.post("login", formData);
    if (response.status === 200) {
      api.setAuthToken(response.token,'cookie');
      login(response.token, response.user);
      setLoading(false);
    }else if(response.status === 401){
      setLoading(false);
      setGen(response.message);
    }
  } catch (error:any) {
    setLoading(false);
    console.log(error.response?.data.errors)
    if (error.response?.data !== undefined) {
      setErrors(error.response?.data.errors);
    }
  }
    
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md rounded-2xl bg-white/10 p-8 backdrop-blur-md shadow-2xl border border-white/20"
      >
        <h2 className="text-3xl font-bold text-center text-white mb-6">
          Welcome Back
        </h2>

        {Gen && (
          <div className="mb-4 text-red-400 text-center font-semibold">
           {Gen}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="text-white/70 text-sm mb-1 block">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full rounded-xl border border-white/20 bg-white/10 p-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter your email"
            />
            <p className="text-red-900">{errors.password}</p>
          </div>

          <div>
            <label className="text-white/70 text-sm mb-1 block">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
      
              className="w-full rounded-xl border border-white/20 bg-white/10 p-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter password"
            />
            <p className="text-red-900">{errors.password}</p>
            <div className="text-center text-sm text-white/60 mt-4">
            Forgot your password?{" "}
            <Link href="/Auth/ForgetPassword" className="text-blue-400 hover:underline">
              Reset it 
            
            </Link>
          </div>
          </div>

       {loading?(<SubmitLoaders/>):(  <button type="submit"  className="w-full rounded-xl bg-blue-600 hover:bg-blue-700 transition-all duration-300 p-3 text-white font-semibold shadow-md">Log In </button>)} 

          <div className="text-center text-sm text-white/60 mt-4">
            Don't have an account?{" "}
            <Link href="/Auth/Register" className="text-blue-400 hover:underline">
              Sign up
            </Link>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
