// Signup form — email (@uw.edu validation), password
"use client";

import React, { useState } from "react";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import Button from "@/components/Button";

interface SignupFormProps {
  onToggle: () => void;
}

export default function SignupForm({ onToggle }: SignupFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    if (!email.endsWith("@uw.edu")) {
      alert("Please use a valid @uw.edu email address.");
      return;
    }

    console.log("Signup attempt:", { email, password });
    // TODO: Add Supabase signUp here
  }

  return (
    <form onSubmit={handleSubmit} className="auth-form">
      <div className="input-group">
        <label htmlFor="signup-email">UW Email address</label>
        <div className="input-wrapper">
          <Mail className="input-icon" />
          <input
            id="signup-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="you@uw.edu"
          />
        </div>
      </div>

      <div className="input-group">
        <label htmlFor="signup-password">Password</label>
        <div className="input-wrapper">
          <Lock className="input-icon" />
          <input
            id="signup-password"
            type={isPasswordVisible ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Create a password"
          />
          <Button
            type="button"
            onClick={() => setIsPasswordVisible(!isPasswordVisible)}
            className="toggle-password"
          >
            {isPasswordVisible ? <EyeOff /> : <Eye />}
          </Button>
        </div>
      </div>

      <Button type="submit" className="submit-button">
        Sign up
      </Button>

      <p className="toggle-mode">
        {"Already have an account? "}
        <Button type="button" onClick={onToggle} className="toggle-mode-button">
          Sign in
        </Button>
      </p>
    </form>
  );
}
