"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authAPI } from "@/services/api";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await authAPI.login(form.username, form.password);

      if (data.success) {
        // Store token and user info
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        // Route based on role
        switch (data.user.role) {
          case "admin":
            router.push("/admin");
            break;
          case "teacher":
            router.push("/teacher/dashboard");
            break;
          case "student":
            router.push("/student/dashboard");
            break;
          case "staff":
            router.push("/staff/dashboard");
            break;
          case "parent":
            router.push("/parent/dashboard");
            break;
          default:
            router.push("/");
        }
      } else {
        setError(data.message || "Login failed");
      }
    } catch (err) {
      setError("Network error. Please try again.");
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-[#C8102E] flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
            </svg>
          </div>
          <h1 className="text-3xl font-extrabold text-white mb-2">Lakshya LMS</h1>
          <p className="text-gray-400 text-sm">Sign in to your account</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-start gap-2">
                <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            {/* Username */}
            <div>
              <label htmlFor="username" className="block text-sm font-semibold text-gray-700 mb-2">
                Username
              </label>
              <input
                id="username"
                type="text"
                required
                value={form.username}
                onChange={(e) => setForm((p) => ({ ...p, username: e.target.value }))}
                placeholder="Enter your username"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#C8102E] focus:ring-2 focus:ring-[#C8102E]/10 transition"
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                value={form.password}
                onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
                placeholder="Enter your password"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#C8102E] focus:ring-2 focus:ring-[#C8102E]/10 transition"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-[#C8102E] text-white font-bold rounded-xl hover:bg-[#a50d25] transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </span>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 pt-6 border-t border-gray-100 text-center">
            <Link href="/" className="text-sm text-gray-500 hover:text-[#C8102E] transition-colors">
              ← Back to Home
            </Link>
          </div>
        </div>

        {/* Info Text */}
        <p className="text-center text-gray-400 text-xs mt-6">
          Contact your administrator if you've forgotten your password
        </p>
      </div>
    </div>
  );
}
