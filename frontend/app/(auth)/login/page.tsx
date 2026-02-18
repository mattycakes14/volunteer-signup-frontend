// Login page — toggles between LoginForm and SignupForm
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getSession } from "@/lib/auth";
import { ROUTES } from "@/lib/routes";
import LoginForm from "@/components/auth/LoginForm";
import SignupForm from "@/components/auth/SignupForm";
import loginStyles from "@/components/auth/Login.module.css";
import signupStyles from "@/components/auth/Signup.module.css";

export default function LoginPage() {
  const router = useRouter();
  const [isSignUp, setIsSignUp] = useState(false);

  useEffect(() => {
    const session = getSession();
    if (session) {
      router.push(ROUTES.DASHBOARD);
    }
  }, []);

  function toggle() {
    setIsSignUp(!isSignUp);
  }

  return (
    <main className={isSignUp ? signupStyles.signupPage : loginStyles.loginPage}>
      {isSignUp ? (
        <SignupForm onToggle={toggle} />
      ) : (
        <LoginForm onToggle={toggle} />
      )}
    </main>
  );
}
