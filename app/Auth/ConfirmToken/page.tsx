"use client";

import { useState } from "react";
import { api } from "next-laravel-apihelper";
import Swal from "sweetalert2";
import { Loader2, KeyRound } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [password_confirmation, setpassword_confirmation] = useState("");
  const [loading, setLoading] = useState(false);
  const [tokenError, setTokenError] = useState("");
  const [newPasswordError, setNewPasswordError] = useState("");
 

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
     const resp= await api.post("/passwordReset", { token, password: newPassword, password_confirmation });
    
    if (resp.status===200) {
        Swal.fire("Success 🔥", "Password updated. Login now.", "success");
      router.push("/Auth/Login");
    }
    if(resp.status===401) {
      setTokenError("Invalid token or password mismatch.");
    }
    } catch (err) {
      if (err instanceof Error && 'response' in err) {
        setNewPasswordError((err as any).response?.data.errors);
      }
    //  setError("Failed to reset password. Please try again.");
      //Swal.fire("Error", "Failed to reset password. Please try again.", "error");
      
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-2xl w-full max-w-md">
        <div className="flex flex-col items-center gap-2 mb-8">
          <KeyRound size={48} className="text-white" />
          <h1 className="text-3xl font-bold text-white">Reset Password</h1>
          <p className="text-sm text-gray-400 text-center">Enter the 6-digit code and a new password.</p>
        </div>

        <form onSubmit={handleResetPassword} className="space-y-5">
          <input
            type="text"
            maxLength={6}
            placeholder="6-digit code"
            className="w-full px-5 py-3 rounded-lg bg-white/10 text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
            required
            value={token}
            onChange={(e) => setToken(e.target.value)}
          />
          <p className="text-red-600">{tokenError}</p>

          <input
            type="password"
            placeholder="New Password"
            className="w-full px-5 py-3 rounded-lg bg-white/10 text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
            required
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
           <p className="text-red-600">{newPasswordError}</p>

          <input
            type="password"
            placeholder="Confirm Password"
            className="w-full px-5 py-3 rounded-lg bg-white/10 text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
            required
            value={password_confirmation}
            onChange={(e) => setpassword_confirmation(e.target.value)}
          />
          
          <button
            type="submit"
            className="w-full py-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 font-semibold text-white"
            disabled={loading}
          >
            {loading ? <Loader2 className="animate-spin w-5 h-5 mx-auto" /> : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
}
