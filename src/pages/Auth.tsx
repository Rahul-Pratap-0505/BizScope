
import React, { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Copyright } from "lucide-react";

export default function AuthPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"sign-in" | "sign-up">("sign-in");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    if (mode === "sign-in") {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        setError(error.message);
      } else {
        setSuccess("Signed in!");
        setTimeout(() => navigate("/"), 500);
      }
    } else {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: window.location.origin + "/auth",
        },
      });
      if (error) {
        setError(error.message);
      } else {
        setSuccess(
          "✨ Check your inbox to verify your email, then come back to sign in."
        );
      }
    }
    setLoading(false);
  };

  return (
    <div 
      className="relative min-h-screen w-full flex flex-col justify-center items-center bg-gradient-to-br from-blue-300 via-indigo-100 to-sky-200 dark:from-[#1e2251] dark:via-[#222a4a] dark:to-[#1e2261] px-0 sm:px-4 overflow-hidden"
      style={{ minWidth: 0, width: "100vw", maxWidth: "100vw" }}
    >
      {/* Modern blurred abstract shapes */}
      <div className="absolute top-[-6rem] left-[-9rem] w-60 h-60 sm:w-72 sm:h-72 bg-blue-400/30 rounded-full blur-3xl pointer-events-none animate-fade-in" />
      <div className="absolute bottom-[-6rem] right-[-9rem] w-64 h-64 sm:w-80 sm:h-80 bg-indigo-400/30 rounded-full blur-3xl pointer-events-none animate-fade-in" />
      {/* Glassmorphic Card */}
      <div className="w-full mx-auto max-w-[420px] glass-card bg-white/60 dark:bg-[#272a3f]/80 shadow-2xl rounded-xl sm:rounded-2xl p-3 sm:p-7 flex flex-col gap-6 sm:gap-8 border border-blue-300/40 dark:border-blue-900/30 backdrop-blur-[18px] animate-scale-in duration-200"
           style={{
             minWidth: 0,
             marginLeft: "auto",
             marginRight: "auto",
             maxWidth: "98vw",
           }}>
        {/* Logo + Tagline */}
        <div className="flex flex-col items-center gap-1 sm:gap-2 mb-1">
          <span className="inline-block mb-0.5 shadow-lg rounded-full border-2 border-blue-300/40 dark:border-blue-900/30 bg-white/80 dark:bg-blue-900/30 animate-fade-in">
            <svg width="40" height="40" viewBox="0 0 48 48" fill="none">
              <rect width="48" height="48" rx="14" fill="#2563eb"/>
              <circle cx="24" cy="24" r="14" fill="#fff"/>
              <circle cx="24" cy="24" r="9" fill="#2563eb" />
              <text x="24" y="29" textAnchor="middle" fontWeight="bold" fontSize="18" fill="#fff" fontFamily="Arial, sans-serif">B</text>
            </svg>
          </span>
          <span className="text-xl sm:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-tr from-blue-800 via-indigo-600 to-sky-400 drop-shadow tracking-tight font-playfair text-center">
            BizScope
          </span>
          <p className="text-center text-xs sm:text-sm text-muted-foreground font-medium">
            <span className="animate-pulse">Insight into Business. Instantly.</span>
          </p>
        </div>
        <form
          onSubmit={handleAuth}
          className="flex flex-col gap-2 sm:gap-3 w-full"
        >
          <h2 className="text-lg sm:text-xl font-extrabold text-center mb-1 text-blue-900 dark:text-white/80 tracking-tight transition">
            {mode === "sign-in" ? "Welcome back!" : "Let's get you started"}
          </h2>
          <p className="text-center text-xs sm:text-sm text-muted-foreground mb-2">
            {mode === "sign-in"
              ? "Sign in to your account"
              : "Create your free BizScope account"}
          </p>
          <label htmlFor="email" className="sr-only">Email</label>
          <Input
            id="email"
            type="email"
            placeholder="rahul@bizscope.com"
            required
            value={email}
            autoComplete="email"
            spellCheck={false}
            inputMode="email"
            onChange={(e) => setEmail(e.target.value)}
            className="shadow-none border border-blue-200/60 focus:border-blue-500 focus:ring-2 focus:ring-blue-200/60 bg-white/70 dark:bg-[#232342] h-11 text-base sm:text-sm"
            style={{ minWidth: 0 }}
          />
          <label htmlFor="password" className="sr-only">Password</label>
          <Input
            id="password"
            type="password"
            placeholder="Password"
            required
            value={password}
            autoComplete={mode === "sign-up" ? "new-password" : "current-password"}
            onChange={(e) => setPassword(e.target.value)}
            className="shadow-none border border-blue-200/60 focus:border-blue-500 focus:ring-2 focus:ring-blue-200/60 bg-white/70 dark:bg-[#232342] h-11 text-base sm:text-sm"
            style={{ minWidth: 0 }}
          />
          {error && (
            <div className="text-destructive bg-destructive/10 px-2 py-1 rounded text-sm text-center animate-fade-in mb-1 transition-all border border-destructive/20">
              {error}
            </div>
          )}
          {success && (
            <div className="text-green-700 bg-green-100 px-2 py-1 rounded text-sm text-center animate-fade-in mb-1 border border-green-200 transition-all">
              {success}
            </div>
          )}
          <Button
            type="submit"
            className="mt-2 bg-gradient-to-r from-blue-500 via-indigo-500 to-sky-400 text-white shadow-lg hover:scale-105 hover:shadow-xl transition-transform duration-200 font-semibold py-2 rounded-xl tracking-wide text-base disabled:opacity-80 h-11"
            style={{ minWidth: 0 }}
            disabled={loading}
          >
            {mode === "sign-in"
              ? (loading ? "Signing In..." : "Sign In")
              : loading ? "Signing Up..." : "Sign Up"}
          </Button>
          <button
            type="button"
            className="mx-auto text-sm mt-2 text-blue-700 dark:text-blue-300 underline underline-offset-4 hover:text-blue-500 dark:hover:text-blue-200 font-semibold focus-visible:outline-none transition"
            style={{ minWidth: 0 }}
            onClick={() => {
              setError(null);
              setSuccess(null);
              setMode(mode === "sign-in" ? "sign-up" : "sign-in");
            }}
          >
            {mode === "sign-in"
              ? <>Don&apos;t have an account? <span className="font-bold">Sign Up</span></>
              : <>Already registered? <span className="font-bold">Sign In</span></>
            }
          </button>
        </form>
        {/* Copyright/credits */}
        <div className="text-xs text-gray-400 text-center mt-4 opacity-80 select-none pt-4 border-t border-muted flex items-center justify-center gap-1">
          <Copyright className="w-3.5 h-3.5 inline-block mb-0.5" />
          <span>Created by Rahul Pratap</span>
        </div>
      </div>
    </div>
  );
}
