"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { api } from "next-laravel-apihelper";
import { Loader2, Upload } from "lucide-react";
import Swal from "sweetalert2";
import Link from "next/link";
import { useAuth } from "../../../context/AuthContext";


export default function EditUserPage() {
  const router = useRouter();
 
  const { userCred, User,Base_image_url } = useAuth();
  const [user, setUser] = useState(userCred);
  const [password, setPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [profileImage, setProfileImage] = useState<Blob>(new Blob);
  const [preview, setPreview] = useState<string | null>();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      console.log(e.target.files[0]);
      setProfileImage(e.target.files[0]);
      setPreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    try {
      const formData = new FormData();
      formData.append("name", user.name);
      formData.append("email", user.email);
      formData.append("phone", user.phone || "");
      if (password.length > 0) formData.append("password", password);
      
   
    
  if(profileImage.size !=0){
      formData.append("profile_image", profileImage); 
      console.log(profileImage.size);
  }

      const resp = await api.post("/updateUser", formData);

      User(resp.user); // Update context
      Swal.fire("Success", "User updated successfully", "success");
   router.push("/Dashbord");
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to update user", "error");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Edit User</h2>
        <Link href="/Dashbord/" className="text-white hover:underline text-sm">
          ← Back to Users
        </Link>
      </div>

      <form
        onSubmit={handleSave}
        className="space-y-6 bg-white/10 backdrop-blur-md p-8 rounded-xl shadow-xl" encType="multipart/form-data" >
      
        {/* Profile Image Upload */}
<div className="relative flex flex-col items-center gap-3">
  <div className="relative">
    {preview ? (
      <img
        src={preview}
        alt="Profile Preview"
        className="w-24 h-24 rounded-full object-cover border-2 border-indigo-400"
      />
    ) : (
     
      <img
      src={Base_image_url+userCred.image}
      alt="Profile Preview"
      className="w-24 h-24 rounded-full object-cover border-2 border-indigo-400"
    />
    )}
    {/* Pencil Icon */}
    <label className="absolute bottom-0 right-0 bg-indigo-600 p-1 rounded-full cursor-pointer hover:bg-indigo-700">
      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        className="hidden"
      />
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 24 24" fill="currentColor">
        <path d="M15.232 5.232l3.536 3.536-10.606 10.606-3.536-3.536L15.232 5.232zM4 20h4l-4-4v4z"/>
      </svg>
    </label>
  </div>
</div>


        {/* Name */}
        <div className="space-y-2">
          <label className="block text-white text-sm">Full Name</label>
          <input
            type="text"
            className="w-full rounded bg-white/20 px-4 py-2 text-white focus:outline-none"
            value={user.name}
            onChange={(e) => setUser({ ...user, name: e.target.value })}
            required
          />
        </div>

        {/* Email */}
        <div className="space-y-2">
          <label className="block text-white text-sm">Email</label>
          <input
            type="email"
            className="w-full rounded bg-white/20 px-4 py-2 text-white focus:outline-none"
            value={user.email}
            onChange={(e) => setUser({ ...user, email: e.target.value })}
            required
          />
        </div>

        {/* Phone */}
        <div className="space-y-2">
          <label className="block text-white text-sm">Phone (optional)</label>
          <input
            type="text"
            className="w-full rounded bg-white/20 px-4 py-2 text-white focus:outline-none"
            value={user.phone || ""}
            onChange={(e) => setUser({ ...user, phone: e.target.value })}
          />
        </div>

        {/* Password */}
        <div className="space-y-2">
          <label className="block text-white text-sm">Password (leave blank to keep current)</label>
          <input
            type="password"
            className="w-full rounded bg-white/20 px-4 py-2 text-white focus:outline-none"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {/* Save Button */}
        <div>
          <button
            type="submit"
            disabled={saving}
            className="w-full py-2 rounded bg-blue-600 hover:bg-blue-700 text-white font-bold"
          >
            {saving ? <Loader2 className="animate-spin w-5 h-5 mx-auto" /> : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
