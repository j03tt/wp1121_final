"use client";

import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

import { publicEnv } from "@/lib/env/public";

import { Button } from "@/components/ui/button";

export default function SignOutButton() {
	const { data: session } = useSession();
	const router = useRouter();

	const handleSignOut = async () => {
	if (session) {
		await signOut({ callbackUrl: publicEnv.NEXT_PUBLIC_BASE_URL });
		// router.push("/auth");
	}
	};

	return <Button variant={"outline"} onClick={handleSignOut}>Sign Out</Button>;
}
