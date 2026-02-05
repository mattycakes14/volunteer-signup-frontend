// Login page — toggles between LoginForm and SignupForm
"use client";

import { useState } from "react";
import LoginForm from "@/components/auth/LoginForm";
import SignupForm from "@/components/auth/SignupForm";
import "@/components/auth/auth.css";

export default function LoginPage() {
  const [isSignUp, setIsSignUp] = useState(false);

  function toggle() {
    setIsSignUp(!isSignUp);
  }

  return (
    <main className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <header className="auth-header">
            <h1>{isSignUp ? "Create Account" : "Welcome Back"}</h1>
            <p>{isSignUp ? "Sign up with your UW email" : "Sign in to your account"}</p>
          </header>

          {isSignUp ? (
            <SignupForm onToggle={toggle} />
          ) : (
            <LoginForm onToggle={toggle} />
          )}
        </div>
      </div>
    </main>
  );
}
