// Login form — email + password, calls Supabase signIn
"use client";

import React, { useState } from "react";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import Button from "@/components/Button";

interface LoginFormProps {
  onToggle: () => void;
}

export default function LoginForm({ onToggle }: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    console.log("Login attempt:", { email, password });
    // TODO: Add Supabase signIn here
  }

  return (
    <form onSubmit={handleSubmit} className="auth-form">
      <div className="input-group">
        <label htmlFor="email">UW Email address</label>
        <div className="input-wrapper">
          <Mail className="input-icon" />
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Enter your email"
          />
        </div>
      </div>

      <div className="input-group">
        <label htmlFor="password">Password</label>
        <div className="input-wrapper">
          <Lock className="input-icon" />
          <input
            id="password"
            type={isPasswordVisible ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Enter your password"
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
        Sign in
      </Button>

      <p className="toggle-mode">
        {"Don't have an account? "}
        <Button type="button" onClick={onToggle} className="toggle-mode-button">
          Sign up
        </Button>
      </p>
    </form>
  );
}
