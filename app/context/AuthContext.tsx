'use client'

import React, { createContext,useContext,useEffect, useState } from "react"
import Cookies from 'js-cookie';
import { useRouter } from "next/navigation";

const AuthContext=createContext<{
isAuthenticated: boolean;
login: (token: string, data: { name: string; email: string; phone: string; image: string; budget: string; balance: string }) => void;
logout: () => void;
userCred: {name: string; email: string; phone: string; image:string,budget:string,balance:string};
token: string;
prevURL:string;
BASE_URL: string;
Base_image_url:string;
setterURL:(url:string)=>void;
User: (data: { name: string; email: string; phone: string; image:string,budget:string,balance:string }) => void;
}>({
isAuthenticated:false,
login:()=>{},
logout:()=>{},
userCred:{name:"",email:"",phone:"",image:"",budget:'',balance:''},
token:"",
prevURL:"",
BASE_URL:"",
Base_image_url:"",
setterURL:()=>{},
User:()=>{},
})
export function AuthProvider({ children }:{children:React.ReactNode}) {
    const router=useRouter();
const [isAuthenticated, setisAuthenticated] = useState(false)
const [userCred, setuserCred] = useState<{name: string; email: string; phone: string; image: string; budget: string; balance: string}>({name:"",email:"",phone:"",image:"",budget:"",balance:""})
const [token, setToken] = useState("")
//https://taskfront-3n6h.onrender.com http://localhost:3000/
const [prevURL,setPrevURL]=useState("https://taskfront-3n6h.onrender.com/")
const [BASE_URL] = useState("https://taskfront-3n6h.onrender.com/")
const [Base_image_url] = useState("https:\/\/raw.githubusercontent.com\/okoloemeka37\/ImageHolder\/main\/uploads\/")
useEffect(() => {
 if (Cookies.get('authToken')) {
    const user=JSON.parse(Cookies.get('user')!)

    setisAuthenticated(true)
    setToken(Cookies.get('authToken')!)
    setuserCred(user)
    if (user.email_verified_at==null) {
        router.push(BASE_URL+"verify-email")
        
    }else{
        router.push(BASE_URL+"Dashbord");
    }
 }
}, [])

const login=(token:string,data:{name:string,email:string,phone:string,image:string,budget:string,balance:string})=>{
Cookies.set('user',JSON.stringify(data))
setisAuthenticated(true)
setToken(token)
setuserCred(data);
router.push(prevURL)

}

const logout=()=>{
    setToken("")
    setisAuthenticated(false)
    setuserCred({name:"",email:"",phone:"",image:"",budget:'',balance:''})
    Cookies.remove('authToken')
    Cookies.remove('user')
}
const setterURL=(url:string)=>{
    setPrevURL(url)
}
const User=(data:{name:string,email:string,phone:string,image:string,budget:string,balance:string})=>{
    setuserCred(data)
    Cookies.set('user',JSON.stringify(data))    
}

return(
    <AuthContext.Provider value={{isAuthenticated,login,logout,userCred,token,prevURL,BASE_URL,Base_image_url,setterURL,User}}>
        {children}
        </AuthContext.Provider>
)
}

export function useAuth(){
    return  useContext(AuthContext)
}