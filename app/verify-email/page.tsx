'use client';


import { MailCheck } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { api } from 'next-laravel-apihelper';
import Swal from 'sweetalert2';
import SubmitLoaders from '../components/Loaders';
import { useState } from 'react';



export default function VerifyEmailPage() {

  const router = useRouter();
  const {BASE_URL,userCred,User}=useAuth()
  const [loading, setloading] = useState(false)

  const check=async()=>{
    setloading(true)
    const response = await api.get(`checkUser/${userCred.email}`);
  
    if (response.exists) {
      setloading(false)
     User(response.user);
      router.push(BASE_URL+"Dashbord")
    }else{
     setloading(false)
      Swal.fire({
        title: 'Unverified Email',
        text: 'You have not verified your email yet.',
        icon: 'warning',
        confirmButtonText: 'OK',
        confirmButtonColor: '#d33',
       
      })
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-white to-gray-100 px-4">
      <div className="max-w-md w-full text-center bg-white shadow-2xl p-10 rounded-2xl">
        <div className="flex justify-center mb-6">
          <div className="bg-yellow-400 p-4 rounded-full shadow-lg">
            <MailCheck className="h-10 w-10 text-white" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Verify Your Email
        </h1>
        <p className="text-gray-500 mb-6">
          We’ve sent you an email with a link to verify your account. Please check your inbox and follow the instructions to complete your registration.
        </p>
      {loading?(<SubmitLoaders/>):(<button   className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 px-6 rounded-xl"onClick={check} >  Already verified </button>)}  
      </div>
    </div>
  );
}
