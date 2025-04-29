'use client'

import { useRouter } from "next/navigation";
import { useAuth } from "./context/AuthContext";
import { api } from "next-laravel-apihelper";
import { useEffect } from "react";

export default function Home() {
 
  const router=useRouter()

  useEffect(() => {
    router.push('/Dashbord')
  }, [router])
  
  return (
    <>
      <button className="" >logout</button>
    </>
  );
}
