// Login form — email + password, calls Supabase signIn
"use client";

import React, { useState } from "react";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import Button from "@/components/Button";
import { signIn } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/lib/routes";

// image imports
import Image from "next/image";
import passwordIcon from "@/public/passwordIcon.png";
import emailIcon from "@/public/emailIcon.png";
import smallIcon from "@/public/smallIcon.png";

interface LoginFormProps {
  onToggle: () => void;
}

export default function LoginForm({ onToggle }: LoginFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setIsLoading(true);
    try {
      const res = await signIn(email, password);
      router.push(ROUTES.DASHBOARD);
    } catch (error) {
      console.log("sign in attemp failed");
      setError(error instanceof Error ? error : new Error("sign in failed"));
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="loginContainer">
      <Image
        className="iconLogo"
        src={smallIcon}
        alt="small icon logo here"
      />
      <div className="headerText">UDSM Outreach Portal</div>
      <div className="headerDescription">
        Welcome back, please login to your account.
      </div>
      <form onSubmit={handleSubmit}>
        <div className="inputContainer">
        <label className="inputLabels" htmlFor="email">
          Email address
        </label>
        <div className="inputWrapper">
          <Image className="inputIcons" src={emailIcon} alt="email icon" />
          <input
            className="inputBox"
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Enter your email"
          />
        </div>
        <label className="inputLabels" htmlFor="password">
          Password
        </label>

        <div className="inputWrapper">
          <Image
            className="inputIcons"
            src={passwordIcon}
            alt="password icon"
          />
          <Button
            className="visibility"
            type="button"
            onClick={() => setIsPasswordVisible(!isPasswordVisible)}
          >
            {isPasswordVisible ? <EyeOff /> : <Eye />}
          </Button>
          <input
            className="inputBox"
            id="password"
            type={isPasswordVisible ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Enter your password"
          />
        </div>

        {error && <p>{error.message}</p>}

        <Button className="signInBox" type="submit" disabled={isLoading}>
          {isLoading ? "Signing in..." : "Sign In"}
        </Button>
      </div>

        <p className="bottomContent">
          {"Don't have an account? "}
          <Button className="signUpButton" type="button" onClick={onToggle}>
            Sign up
          </Button>
        </p>
      </form>
    </div>
  );
}
