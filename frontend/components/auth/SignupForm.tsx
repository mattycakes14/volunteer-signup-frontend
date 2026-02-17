// Signup form — email (@uw.edu validation), password, name, role, phone, year, major
"use client";

import React, { useState } from "react";
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  User,
  Phone,
  GraduationCap,
  BookOpen,
} from "lucide-react";
import Button from "@/components/Button";
import { signUp } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/lib/routes";
import { UserRole } from "@/types";
import "@/components/auth/signup.css";

import Image from "next/image";
import smallIcon2 from "@/public/smallIconWithOutStyles.png";
import stockImage from "@/public/stockImage.png";
import grad from "@/public/gradIcon.png";

interface SignupFormProps {
  onToggle: () => void;
}

export default function SignupForm({ onToggle }: SignupFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState<UserRole>(UserRole.UNDERGRAD);
  const [phone, setPhone] = useState("");
  const [year, setYear] = useState("");
  const [major, setMajor] = useState("");
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
      await signUp({
        email,
        password,
        name,
        role,
        phone_number: phone,
        year,
        major,
      });
      router.push(ROUTES.DASHBOARD);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Sign up failed");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="signUpContainer">
      <div className="leftPanel">
        <div className="titleHeader">
          <Image
            className="signupSmallIcon"
            src={smallIcon2}
            alt="small icon logo"
          />
          <div>UDSM Outreach</div>
        </div>
        <div className="mainHeader">
          Join the <span>Volunteers.</span>
        </div>
        <div className="signupHeaderDesc">
          Create your account to access the volunteer portal, manage shifts, and
          track your impact in the community.
        </div>
        <Image className="stockImage" src={stockImage} alt="stock image" />
      </div>
      <div className="rightPanel">
        <div className="createAccount">Create your account</div>
        <div className="createAccountDesc">
          Please fill in your details to get started.
        </div>
        <div className="rolePills">
          <button
            type="button"
            className={`rolePill ${role === UserRole.UNDERGRAD ? "rolePillActive" : ""}`}
            onClick={() => setRole(UserRole.UNDERGRAD)}
          >
            Undergraduate (Scribe)
          </button>
          <button
            type="button"
            className={`rolePill ${role === UserRole.GRAD ? "rolePillActive" : ""}`}
            onClick={() => setRole(UserRole.GRAD)}
          >
            Graduate Student
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="firstContainer">
            <div>
              <label className="signUpInputLabels" htmlFor="signup-name">
                FULL NAME
              </label>
              <div>
                <input
                  className="signUpInputBoxes"
                  id="signup-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="Enter your full name"
                />
              </div>
            </div>
            <div>
              <label className="signUpInputLabels" htmlFor="signup-phone">
                PHONE NUMBER
              </label>
              <div>
                <input
                  className="signUpInputBoxes"
                  id="signup-phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="(206) 555-0123"
                  required
                />
              </div>
            </div>
          </div>
          <div className="emailInputBox">
            <label className="signUpInputLabels" htmlFor="signup-email">
              UNIVERSITY EMAIL
            </label>
            <div className="signUpInputWrapper">
              <Image src={grad} alt="Grad Icon" />
              <input
                className="signUpInputBoxes"
                id="signup-email"
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="yourname@uw.edu"
                required
              />
            </div>
            <div className="emailFinePrint">
              Must be a valid @uw.edu address
            </div>
          </div>

          <div className="secondContainer">
            <div>
              <label className="signUpInputLabels" htmlFor="signup-major">
                MAJOR
              </label>
              <div>
                <input
                  className="signUpInputBoxes"
                  id="signup-major"
                  type="text"
                  value={major}
                  onChange={(e) => setMajor(e.target.value)}
                  placeholder="e.g. Biology, Nursing"
                  required
                />
              </div>
            </div>
            <div>
              <label className="signUpInputLabels" htmlFor="signup-year">
                ACADEMIC YEAR
              </label>
              <div>
                <select
                  className="signUpSelectBox"
                  id="signup-year"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  required
                >
                  <option value="">Select Year</option>
                  <option value="Freshman">Freshman</option>
                  <option value="Sophomore">Sophomore</option>
                  <option value="Junior">Junior</option>
                  <option value="Senior">Senior</option>
                </select>
              </div>
            </div>
          </div>
          <div className="passwordInputBox">
            <label className="signUpInputLabels" htmlFor="signup-password">
              PASSWORD
            </label>
            <div className="signUpInputWrapper">
              <input
                className="signUpInputBoxes"
                id="signup-password"
                type={isPasswordVisible ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Create a password"
              />
            </div>
          </div>

          {error && <p>{error}</p>}

          <Button
            className="createAccountBtn"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? "Signing up..." : "Create Account"}
          </Button>

          <p className="alreadyHaveAnAccount">
            {"Already have an account? "}
            <Button
              className="alreadyHaveAccountSignIn"
              type="button"
              onClick={onToggle}
            >
              Sign in
            </Button>
          </p>
        </form>
      </div>
    </div>
  );
}
