"use client";

import { useState } from "react";
import {
  FiUser,
  FiMail,
  FiLock,
  FiPhone,
  FiCamera,
  FiBriefcase,
} from "react-icons/fi";
import Link from "next/link";
import { useLogin } from "@/context/LoginContext";

export default function RegisterForm() {
  const { registerUser } = useLogin();

  const [input, setInput] = useState({
    image: "",
    name: "",
    email: "",
    department: "",
    password: "",
    phone: "",
  });
  const [confirmPass, setConfirmPass] = useState("");

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (input.password !== confirmPass) {
      return console.log("Passwords do not match..!!");
    }
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("image", input.image);
      formData.append("name", input.name);
      formData.append("email", input.email);
      formData.append("department", input.department);
      formData.append("password", input.password);
      formData.append("phone", input.phone);
      await registerUser(formData);
      setInput({
        image: "",
        name: "",
        email: "",
        phone: "",
        department: "",
        password: "",
      });
      setConfirmPass("");
    } catch (error) {
      console.log("Execution failed..!!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-slate-50 min-h-screen flex items-center justify-center mt-15 p-6">
      <div className="w-full max-w-4xl bg-white border border-slate-200 rounded-2xl p-8 shadow-xl">
        <h2 className="text-2xl font-bold text-slate-900 mb-6 text-center">
          Create Account
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-2">
              Profile Image
            </label>
            <label className="flex flex-col items-center justify-center w-full h-28 bg-slate-50 border border-dashed border-slate-300 hover:border-emerald-500 rounded-xl cursor-pointer transition-all p-4 text-center">
              <FiCamera className="text-slate-400 mb-2" size={20} />
              <p className="text-xs text-slate-500">
                {input.image ? (
                  <span className="text-emerald-600 font-semibold">
                    {input.image.name}
                  </span>
                ) : (
                  "Click to upload"
                )}
              </p>
              <input
                type="file"
                name="image"
                accept="image/*"
                className="hidden"
                onChange={(e) =>
                  setInput({ ...input, image: e.target.files[0] })
                }
              />
            </label>
          </div>

          {/* Two-column inputs */}
          <div className="flex flex-col md:flex-row md:flex-wrap gap-6">
            {/* Name */}
            <div className="w-full md:w-[48%]">
              <div className="relative">
                <FiUser className="absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  name="name"
                  required
                  value={input.name}
                  onChange={(e) => setInput({ ...input, name: e.target.value })}
                  placeholder="Full Name"
                  className="w-full border border-slate-300 rounded-lg pl-10 pr-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                />
              </div>
            </div>

            {/* Email */}
            <div className="w-full md:w-[48%]">
              <div className="relative">
                <FiMail className="absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  name="email"
                  required
                  value={input.email}
                  onChange={(e) =>
                    setInput({ ...input, email: e.target.value })
                  }
                  placeholder="Email"
                  className="w-full border border-slate-300 rounded-lg pl-10 pr-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                />
              </div>
            </div>

            {/* Phone */}
            <div className="w-full md:w-[48%]">
              <div className="relative">
                <FiPhone className="absolute left-3 top-3 text-slate-400" />
                <input
                  type="tel"
                  name="phone"
                  required
                  value={input.phone}
                  onChange={(e) =>
                    setInput({ ...input, phone: e.target.value })
                  }
                  placeholder="Phone"
                  className="w-full border border-slate-300 rounded-lg pl-10 pr-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                />
              </div>
            </div>

            {/* Department */}
            <div className="w-full md:w-[48%]">
              <div className="relative">
                <FiBriefcase className="absolute left-3 top-3 text-slate-400" />
                <select
                  name="department"
                  required
                  value={input.department}
                  onChange={(e) =>
                    setInput({ ...input, department: e.target.value })
                  }
                  className="w-full border border-slate-300 rounded-lg pl-10 pr-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                >
                  <option value="">Select Department</option>
                  <option value="SOFTWARE">Software</option>
                  <option value="MEDICAL">Medical</option>
                  <option value="TECHNICIAN">Technician</option>
                  <option value="LABORATORY">Laboratory</option>
                  <option value="GENERAL">General</option>
                </select>
              </div>
            </div>

            {/* Password */}
            <div className="w-full md:w-[48%]">
              <div className="relative">
                <FiLock className="absolute left-3 top-3 text-slate-400" />
                <input
                  type="password"
                  name="password"
                  required
                  value={input.password}
                  onChange={(e) =>
                    setInput({ ...input, password: e.target.value })
                  }
                  placeholder="Password"
                  className="w-full border border-slate-300 rounded-lg pl-10 pr-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                />
              </div>
            </div>

            {/* Confirm Password */}
            <div className="w-full md:w-[48%]">
              <div className="relative">
                <FiLock className="absolute left-3 top-3 text-slate-400" />
                <input
                  type="password"
                  name="password"
                  required
                  value={confirmPass}
                  onChange={(e) => setConfirmPass(e.target.value)}
                  placeholder="Confirm Password"
                  className="w-full border border-slate-300 rounded-lg pl-10 pr-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 rounded-lg transition-all duration-300 shadow-md active:scale-[0.98]"
          >
            {loading ? "Registering new user..." : "Register Now"}
          </button>

          {/* Login Link */}
          <p className="text-center text-sm text-slate-600">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-emerald-600 hover:text-emerald-700 font-medium"
            >
              Login here
            </Link>
          </p>
        </form>
      </div>
    </section>
  );
}
