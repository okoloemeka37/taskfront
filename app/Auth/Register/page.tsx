"use client";


import { useAuth } from "../../context/AuthContext";
import { motion } from "framer-motion";
import { api } from "next-laravel-apihelper";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import SubmitLoaders from "../../components/Loaders";


export default function RegisterPage() {
  
  const {login}=useAuth()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
    phone:"",
  })
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    phone:"",
  });
  const [loading, setloading] = useState(false)
  
  
const handleSubmit= async (e: React.FormEvent) => {
  e.preventDefault();
  setloading(true)
 
 try {
 
  const response= await api.post("/register", formData);
  console.log(response)
  if (response.status == 200) {
    setloading(false)

  api.setAuthToken(response.token,"cookie");// Set the token in cookies storage
  login(response.token,response.user);
  }
 

 
  
 } catch (error:any) {

  if ( error.response?.data !== undefined) {
     setErrors(error.response?.data.errors)
  setloading(false)
  }
 
 }
    
}
  

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md rounded-2xl bg-white/10 p-8 backdrop-blur-md shadow-2xl border border-white/20"
      >
        <h2 className="text-3xl font-bold text-center text-white mb-6">
          Create Account
        </h2>

        {errors && (
          <div className="mb-4 text-red-400 text-center font-semibold">
          
          </div>
        )}

        <form onSubmit={handleSubmit}  className="space-y-5">

          <div>
            <label className="text-white/70 text-sm mb-1 block">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={(e)=>setFormData(prev=>({...prev,name:e.target.value}))}
          
              className="w-full rounded-xl border border-white/20 bg-white/10 p-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400"
              placeholder="Enter your name"
            />
            <p className="text-red-800">{errors['name']}</p>
          </div>

          <div>
            <label className="text-white/70 text-sm mb-1 block">Email</label>
            <input type="email" name="email"value={formData.email}
              onChange={(e)=>setFormData(prev=>({...prev,email:e.target.value}))}
             
              className="w-full rounded-xl border border-white/20 bg-white/10 p-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400"
              placeholder="Enter your email"
            />
            <p className="text-red-800">{errors['email']}</p>
          </div>
          <div>
            <label className="text-white/70 text-sm mb-1 block">Phone Number</label>
            <input type="tel" name="phone" value={formData.phone}
              onChange={(e)=>setFormData(prev=>({...prev,phone:e.target.value}))}   className="w-full rounded-xl border border-white/20 bg-white/10 p-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400"placeholder="Enter your phone number"
            />
            <p className="text-red-800">{errors['phone']}</p>
          </div>

          <div>
            <label className="text-white/70 text-sm mb-1 block">Password</label>
            <input type="password" name="password"value={formData.password}
              onChange={(e)=>setFormData(prev=>({...prev,password:e.target.value}))}
              className="w-full rounded-xl border border-white/20 bg-white/10 p-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400"  placeholder="Enter password"
            />
              <p className="text-red-800">{errors['password']}</p>
          </div>

          <div>
            <label className="text-white/70 text-sm mb-1 block">Confirm Password</label>
            <input type="password" name="confirmPassword" value={formData.password_confirmation}
              onChange={(e)=>setFormData(prev=>({...prev,password_confirmation:e.target.value}))}   className="w-full rounded-xl border border-white/20 bg-white/10 p-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400"placeholder="Confirm password"
            />
         
          </div>
          {loading ? (<SubmitLoaders/>):( <button type="submit" className="w-full rounded-xl bg-blue-600 hover:bg-blue-700 transition-colors p-3 text-white font-semibold mt-4 shadow-md hover:shadow-lg">Register</button>
        )}
          <p className="text-center text-white/50 text-sm mt-4">
            Already have an account? <Link href="/Auth/Login" className="text-blue-400 hover:underline">Login</Link>
          </p>
        </form>
      </motion.div>
    </div>
  );
}
