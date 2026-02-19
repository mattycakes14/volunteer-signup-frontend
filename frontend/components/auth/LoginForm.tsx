// Login form — email + password, calls Supabase signIn
"use client";

import React, { useState } from "react";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import Button from "@/components/Button";
import { signIn } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/lib/routes";
import styles from "./Login.module.css";

// image imports
import Image from "next/image";
import passwordIcon from "@/public/passwordIcon.png";
import emailIcon from "@/public/emailIcon.png";
import smallIcon2 from "@/public/smallIconWithOutStyles.png";

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
    <div className={styles.loginContainer}>
      <Image className={styles.iconLogo} src={smallIcon2} alt="small icon logo here" />
      <div className={styles.headerText}>UDSM Outreach Portal</div>
      <div className={styles.headerDescription}>
        Welcome back, please login to your account.
      </div>
      <form onSubmit={handleSubmit}>
        <div className={styles.inputContainer}>
          <label className={styles.inputLabels} htmlFor="email">
            Email address
          </label>
          <div className={styles.inputWrapper}>
            <Image className={styles.inputIcons} src={emailIcon} alt="email icon" />
            <input
              className={styles.inputBox}
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
            />
          </div>
          <label className={styles.inputLabels} htmlFor="password">
            Password
          </label>

          <div className={styles.inputWrapper}>
            <Image
              className={styles.inputIcons}
              src={passwordIcon}
              alt="password icon"
            />
            <Button
              className={styles.visibility}
              type="button"
              onClick={() => setIsPasswordVisible(!isPasswordVisible)}
            >
              {isPasswordVisible ? <EyeOff /> : <Eye />}
            </Button>
            <input
              className={styles.inputBox}
              id="password"
              type={isPasswordVisible ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your password"
            />
          </div>

          {error && <p>{error.message}</p>}

          <Button className={styles.signInBox} type="submit" disabled={isLoading}>
            {isLoading ? "Signing in..." : "Sign In"}
          </Button>
        </div>

        <p className={styles.bottomContent}>
          {"Don't have an account? "}
          <Button className={styles.signUpButton} type="button" onClick={onToggle}>
            Sign up
          </Button>
        </p>
      </form>
    </div>
  );
}
