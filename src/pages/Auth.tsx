
import React, { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Copyright } from "lucide-react";

export default function AuthPage() {
  const [email, setEmail] = useState("");
  // Username state removed
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
      // Username logic removed
      // Always set emailRedirectTo for sign up
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
          "Check your inbox to verify your email, then come back to sign in."
        );
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-blue-50 via-white to-blue-100 px-4">
      <div className="w-full max-w-sm bg-white/90 shadow-xl rounded-2xl p-8 flex flex-col gap-6 animate-fade-in">
        {/* Logo and Catchy Phrase */}
        <div className="flex flex-col items-center gap-2 mb-1">
          {/* BizScope SVG logo */}
          <span className="inline-block mb-1">
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
              <rect width="48" height="48" rx="14" fill="#2563eb"/>
              <circle cx="24" cy="24" r="14" fill="#fff"/>
              <circle cx="24" cy="24" r="9" fill="#2563eb" />
              <text x="24" y="29" textAnchor="middle" fontWeight="bold" fontSize="18" fill="#fff" fontFamily="Arial, sans-serif">B</text>
            </svg>
          </span>
          <span className="text-2xl font-bold text-blue-700 tracking-tight">BizScope</span>
          <p className="text-center text-base text-muted-foreground mt-1 font-medium">
            Insight into Business. Instantly.
          </p>
        </div>
        <form
          onSubmit={handleAuth}
          className="flex flex-col gap-3"
        >
          <h2 className="text-xl font-semibold text-center mb-1">
            {mode === "sign-in" ? "Sign In to Your Account" : "Create Your Free Account"}
          </h2>
          <Input
            type="email"
            placeholder="Email"
            required
            value={email}
            autoComplete="email"
            onChange={(e) => setEmail(e.target.value)}
          />
          {/* Username field removed for sign-up */}
          <Input
            type="password"
            placeholder="Password"
            required
            value={password}
            autoComplete={mode === "sign-up" ? "new-password" : "current-password"}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && (
            <div className="text-destructive bg-destructive/10 px-2 py-1 rounded text-sm text-center">{error}</div>
          )}
          {success && (
            <div className="text-green-700 bg-green-100 px-2 py-1 rounded text-sm text-center">{success}</div>
          )}
          <Button type="submit" className="mt-2" disabled={loading}>
            {mode === "sign-in"
              ? (loading ? "Signing In..." : "Sign In")
              : loading ? "Signing Up..." : "Sign Up"}
          </Button>
          <button
            type="button"
            className="mx-auto text-sm mt-1 text-blue-700 underline underline-offset-4"
            onClick={() => {
              setError(null);
              setSuccess(null);
              setMode(mode === "sign-in" ? "sign-up" : "sign-in");
            }}
          >
            {mode === "sign-in"
              ? "Don't have an account? Sign Up"
              : "Already have an account? Sign In"}
          </button>
        </form>
        {/* Copyright/Credits */}
        <div className="text-xs text-gray-400 text-center mt-2 opacity-80 select-none pt-2 border-t border-muted flex items-center justify-center gap-1">
          <Copyright className="w-3.5 h-3.5 inline-block mb-0.5" />
          <span>Created by Rahul Pratap</span>
        </div>
      </div>
    </div>
  );
}
