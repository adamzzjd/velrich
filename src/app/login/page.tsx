"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setError("");
    const { error } = await supabase.auth.signInWithOtp({ email });
    if (error) setError(error.message);
    else alert("Check your email for the magic link!");
  };

  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h1>VELRICH Admin Login</h1>
      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ padding: "0.5rem", width: "250px", margin: "1rem 0" }}
      />
      <br />
      <button
        onClick={handleLogin}
        style={{ padding: "0.5rem 1rem", background: "#0B1D39", color: "#fff" }}
      >
        Login
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
