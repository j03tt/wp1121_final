"use client";

import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";

import { publicEnv } from "@/lib/env/public";

import { Button } from "@/components/ui/button";

export default function ProfilePage() {
	const { data: session } = useSession();
	const router = useRouter();
	const { id } = router.query;

	return (
		<div>
			<h1>Profile Page</h1>
			<p>Display ID: {id}</p>
		</div>
	);
}
