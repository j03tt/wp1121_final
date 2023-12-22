"use client";

import { useRouter } from "next/navigation";

import { publicEnv } from "@/lib/env/public";

import { Button } from "@/components/ui/button";

export default function SignInButton() {
    const router = useRouter();

    const handleSignIn = async () => {
        router.push(`${publicEnv.NEXT_PUBLIC_BASE_URL}/auth`);
    };

    return <Button variant={"outline"} onClick={handleSignIn}>Sign In/Up</Button>;
}
