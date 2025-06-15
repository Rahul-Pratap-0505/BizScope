
import React, { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

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
    <div className="min-h-screen flex items-center justify-center bg-background">
      <form
        onSubmit={handleAuth}
        className="bg-white border rounded-md shadow-lg p-8 flex flex-col gap-4 w-full max-w-sm"
      >
        <h2 className="text-2xl font-bold text-center mb-2">
          {mode === "sign-in" ? "Sign In" : "Create Account"}
        </h2>
        <Input
          type="email"
          placeholder="Email"
          required
          value={email}
          autoComplete="email"
          onChange={(e) => setEmail(e.target.value)}
        />
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
        <Button type="submit" disabled={loading}>
          {mode === "sign-in" ? (loading ? "Signing In..." : "Sign In") : loading ? "Signing Up..." : "Sign Up"}
        </Button>
        <button
          type="button"
          className="mx-auto text-sm mt-1 text-blue-700 underline"
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
    </div>
  );
}
