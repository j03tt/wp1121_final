"use client";

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { useState } from "react";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

import Image from "next/image";

// Run: npx shadcn-ui@latest add button
import { Button } from "@/components/ui/button";
// Run: npx shadcn-ui@latest add card
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { publicEnv } from "@/lib/env/public";

import AuthInput from "./AuthInput";

function AuthForm() {
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [isSignUp, setIsSignUp] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  
    if (!email || !password) {
      toast.error("Invalid Input!");
      return;
    }
  
    if (password.length < 8) {
      toast.error("Invalid Input! Password must be at least 8 characters.");
      return;
    }
  
    if (isSignUp) {
      if (!name || !confirmPassword) {
        toast.error("Invalid Input!");
        return;
      }
  
      if (password !== confirmPassword) {
        toast.error("Invalid Input! Confirmed Password must match Password.");
        return;
      }
  
      if (confirmPassword.length < 8) {
        toast.error("Invalid Input! Confirmed Password must be at least 8 characters.");
        return;
      }
    }
    
    signIn("credentials", {
      email,
      name,
      password,
      callbackUrl: `${publicEnv.NEXT_PUBLIC_BASE_URL}`,
    });
  };

  const handleCancel = () => {
    router.push(publicEnv.NEXT_PUBLIC_BASE_URL);
  };
  
  return (
    <Card className="min-w-[300px]">
      <CardHeader>
        <CardTitle>Sign {isSignUp ? "Up" : "In"}</CardTitle>
      </CardHeader>
      <CardContent className=" flex flex-col gap-2">
        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
          {isSignUp ? (
            <AuthInput
              label="Email"
              type="email"
              value={email}
              defaultValue={"Must be unique"}
              setValue={setEmail}
            />
          ) : (
            <AuthInput
            label="Email"
            type="email"
            value={email}
            setValue={setEmail}
          />
          )}

          {isSignUp && (
            <AuthInput
              label="Name"
              type="text"
              value={name}
              defaultValue={"Must be unique"}
              setValue={setName}
            />
          )}

          {isSignUp ? (
            <AuthInput
              label="Password"
              type="password"
              value={password}
              defaultValue={"Must be at least 8 characters"}
              setValue={setPassword}
            />
          ) : (
            <AuthInput
              label="Password"
              type="password"
              value={password}
              setValue={setPassword}
            />
          )}
          
          {isSignUp && (
            <AuthInput
              label="Confirm Password"
              type="password"
              value={confirmPassword}
              setValue={setConfirmPassword}
            />
          )}
          <div className="text-sm text-gray-500">
            {isSignUp ? (
              <span>
                Already have an account?{" "}
                <a
                  className="cursor-pointer hover:underline"
                  onClick={() => setIsSignUp(false)}
                >
                  Sign In
                </a>
              </span>
            ) : (
              <span>
                Do not have an account?{" "}
                <a
                  data-testid="sign-in-up-button"
                  className="cursor-pointer hover:underline"
                  onClick={() => setIsSignUp(true)}
                >
                  Sign Up
                </a>
              </span>
            )}
          </div>

          <Button
            type="submit"
            className="w-full"
          >
            Sign {isSignUp ? "Up" : "In"}
          </Button>
          <Button
            type="button"
            className="w-full"
            onClick={handleCancel}
          >
            Cancel
          </Button>
        </form>
        
        <div className="flex w-full items-center gap-1 py-2">
          <div className="h-[1px] grow border-t"></div>
          <p className="text-xs text-gray-400">or</p>
          <div className="h-[1px] grow border-t"></div>
        </div>

        <Button
          onClick={async () => {
            signIn("github", {
              callbackUrl: `${publicEnv.NEXT_PUBLIC_BASE_URL}`,
            });
          }}
          className="flex w-full"
          variant={"outline"}
        >
          {/* Remember to copy "github.png" to ./public folder */}
          <Image src="/github.png" alt="github icon" width={20} height={20} />
          <span className="grow">Sign In with Github</span>
        </Button>
      </CardContent>
    </Card>
  );
}

export default AuthForm;