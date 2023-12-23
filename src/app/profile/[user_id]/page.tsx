import useAuth from "@/hooks/useAuth";

import { publicEnv } from "@/lib/env/public";

import HeaderBar from "@/components/HeaderBar";

import { Button } from "@/components/ui/button";

type ProfilePageProps = {
    params: {
      // this came from the file name: [user_id].tsx
      user_id: string;
    };
};

export default async function ProfilePage({
    params: { user_id },
}: ProfilePageProps) {
	const { auth } = useAuth();
    const session = await auth();

	return (
		<div className="flex h-screen w-full flex-col overflow-auto pt-2">
			<HeaderBar />
			
			<div className="flex flex-row items-center justify-between px-4 mb-4">
                Profile Page Goes Here, user_id = {user_id}
            </div>
		</div>
	);
}
