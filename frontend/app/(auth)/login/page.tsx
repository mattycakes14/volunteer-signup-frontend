// Login page — toggles between LoginForm and SignupForm
"use client";

import { useState } from "react";
import LoginForm from "@/components/auth/LoginForm";
import SignupForm from "@/components/auth/SignupForm";
import "@/components/auth/login.css";
import "@/components/auth/signup.css";

export default function LoginPage() {
  const [isSignUp, setIsSignUp] = useState(false);

  function toggle() {
    setIsSignUp(!isSignUp);
  }

  return (
    <main>
      {isSignUp ? (
        <LoginForm onToggle={toggle} />
      ) : (
        <SignupForm onToggle={toggle} />
      )}{" "}
    </main>
  );
}
