"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

// import { publicEnv } from "@/lib/env/public";

import { Button } from "@/components/ui/button";

type MyAccountButtonProps = {
    userName: string;
};

export default function MyAccountButton({ userName }: MyAccountButtonProps) {
	const { data: session } = useSession();
	const router = useRouter();

	const handleClick = async () => {
		if (session) {
			router.push(`/profile/${session.user?.id}`);
		}
		else {
			alert("Please log in first.");
		}
	};

	return <Button variant={"outline"} onClick={handleClick}>{userName}&apos;s Account</Button>;
}
