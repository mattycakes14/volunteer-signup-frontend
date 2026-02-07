// Signup form — email (@uw.edu validation), password, name, role
"use client";

import React, { useState } from "react";
import { Eye, EyeOff, Lock, Mail, User } from "lucide-react";
import Button from "@/components/Button";
import { signUp } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/lib/routes";
import { UserRole } from "@/types";

interface SignupFormProps {
  onToggle: () => void;
}

export default function SignupForm({ onToggle }: SignupFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState<UserRole>(UserRole.UNDERGRAD);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setIsLoading(true);

    if (!email.endsWith("@uw.edu")) {
      setError("Please use a valid @uw.edu email address.");
      setIsLoading(false);
      return;
    }

    try {
      await signUp({ email, password, name, role });
      router.push(ROUTES.DASHBOARD);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Sign up failed");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="auth-form">
      <div className="input-group">
        <label htmlFor="signup-name">Full Name</label>
        <div className="input-wrapper">
          <User className="input-icon" />
          <input
            id="signup-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="Enter your full name"
          />
        </div>
      </div>

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

      <div className="input-group">
        <label htmlFor="signup-role">Role</label>
        <select
          id="signup-role"
          value={role}
          onChange={(e) => setRole(e.target.value as UserRole)}
          required
        >
          <option value={UserRole.UNDERGRAD}>Undergraduate</option>
          <option value={UserRole.GRADUATE}>Graduate Student</option>
        </select>
      </div>

      {error && <p className="error-message">{error}</p>}

      <Button type="submit" className="submit-button" disabled={isLoading}>
        {isLoading ? "Signing up..." : "Sign up"}
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
