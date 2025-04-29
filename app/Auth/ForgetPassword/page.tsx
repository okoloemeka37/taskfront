"use client";

import { useState } from "react";
import { api } from "next-laravel-apihelper";
import Swal from "sweetalert2";
import { Loader2, MailIcon } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendToken = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post("/forgotPassword", { email });
      Swal.fire("Success", "Reset code sent to your email.", "success").then(() => {
        router.push("/Auth/ConfirmToken");
      });
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to send reset code.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-2xl w-full max-w-md">
        <div className="flex flex-col items-center gap-2 mb-8">
          <MailIcon size={48} className="text-white" />
          <h1 className="text-3xl font-bold text-white">Forgot Password</h1>
          <p className="text-sm text-gray-400 text-center">Enter your email to receive a reset code.</p>
        </div>

        <form onSubmit={handleSendToken} className="space-y-5">
          <input
            type="email"
            placeholder="Email Address"
            className="w-full px-5 py-3 rounded-lg bg-white/10 text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <button
            type="submit"
            className="w-full py-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 font-semibold text-white"
            disabled={loading}
          >
            {loading ? <Loader2 className="animate-spin w-5 h-5 mx-auto" /> : "Send Code"}
          </button>
        </form>
      </div>
    </div>
  );
}
