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
      <div className="auth-wrapper">
        {/* Left panel — form */}
        <div className="auth-form-panel">
          <header className="auth-header">
            <h1>{isSignUp ? "Create Account" : "Login"}</h1>
            <p>
              {isSignUp
                ? "Sign up with your UW email to get started"
                : "Welcome back! Sign in to your account"}
            </p>
          </header>

          {isSignUp ? (
            <SignupForm onToggle={toggle} />
          ) : (
            <LoginForm onToggle={toggle} />
          )}
        </div>

        {/* Right panel — decorative */}
        <div className="auth-image-panel">
          <div className="panel-wave panel-wave--1" />
          <div className="panel-wave panel-wave--2" />
          <div className="panel-wave panel-wave--3" />
          <div className="glass-card">
            <span className="glass-card-text">UDSM Volunteer Portal</span>
          </div>
        </div>
      </div>
    </main>
  );
}
