import React from 'react'
import { Menu as DropdownMenu, Transition} from "@headlessui/react";
import { Fragment } from "react";

import { User as UserIcon, Settings,LogOut } from "lucide-react";
import { useAuth } from '../context/AuthContext';
import Link from "next/link";
import { api } from 'next-laravel-apihelper';
import { useRouter } from 'next/navigation';
import { ZCOOL_XiaoWei } from 'next/font/google';

export default function DropdownMenuPicture() {
  const router = useRouter();
  
     const { userCred,BASE_URL,logout,Base_image_url } = useAuth(); 
const [loading, setloading] = React.useState(false)
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
    

<DropdownMenu as="div" className="relative inline-block text-left">
  <DropdownMenu.Button className="w-10 h-10 rounded-full ring-2 ring-indigo-500 overflow-hidden focus:outline-none hover:ring-indigo-400 transition">
    <img
      src={Base_image_url +userCred.image}
      alt="User"
      className="w-full h-full object-cover rounded-full"
    />
  </DropdownMenu.Button>

  <Transition
    as={Fragment}
    enter="transition ease-out duration-100"
    enterFrom="transform opacity-0 scale-95"
    enterTo="transform opacity-100 scale-100"
    leave="transition ease-in duration-75"
    leaveFrom="transform opacity-100 scale-100"
    leaveTo="transform opacity-0 scale-95"
  >
    <DropdownMenu.Items className="absolute right-0 z-50 mt-3 w-48 origin-top-right rounded-lg bg-white text-gray-700 shadow-2xl ring-1 ring-black/10 focus:outline-none overflow-hidden">
      <DropdownMenu.Item>
        {({ active }) => (
          <Link
            href="/dashboard/profile"
            className={`flex items-center gap-3 px-4 py-3 text-sm hover:bg-gray-100 ${
              active ? "bg-gray-100" : ""
            }`}
          >
            <UserIcon size={16} /> Profile
          </Link>
        )}
      </DropdownMenu.Item>

      <DropdownMenu.Item>
        {({ active }) => (
          <Link
            href="/Dashbord/User/Edit" 
            className={`flex w-full items-center gap-3 px-4 py-3 text-sm hover:bg-gray-100 ${
              active ? "bg-gray-100" : ""
            }`}
          >
            <Settings size={16} /> Settings
          </Link>
        )}
      </DropdownMenu.Item>

      <DropdownMenu.Item>
        {({ active }) => (
          <button
            className={`flex w-full items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 ${
              active ? "bg-red-100" : ""
            }`}
            onClick={Logo}
          >
            <LogOut size={16} /> Logout
          </button>
        )}
      </DropdownMenu.Item>
    </DropdownMenu.Items>
  </Transition>
</DropdownMenu>
  )
}
