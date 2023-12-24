import Link from "next/link";
import { publicEnv } from "@/lib/env/public";

import useAuth from "@/hooks/useAuth";

import NewSongButton from "@/components/uploadSong";
import SignInButton from "@/components/SignInButton";
import SignOutButton from "@/components/SignOutButton";

export default async function HeaderBar() {
  const { auth } = useAuth();
  const session = await auth();
  const user_id = session?.user?.id;

  return (
    <div className="flex flex-row items-center justify-between px-4 mb-2">
        <Link href={`${publicEnv.NEXT_PUBLIC_BASE_URL}`}>
            <h1 className="px-4 text-xl font-bold text-center">Music!</h1>
        </Link>
        
        <div className="flex items-center gap-4">
        {!session?.user?.id ? (
            <SignInButton />
        ) : (
            <>
                <div className="flex flex-row items-center gap-2">
                    <NewSongButton />
                    {/* Move to the profile page later */}
                    <SignOutButton />
                </div>
                
                {/* profile page goes from here*/}
                <Link 
                    href={{
                        pathname: `/profile/${user_id}`
                    }}>
                    <div className="flex items-center gap-2">
                    {/* [todo: avatar] */}
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-400 cursor-pointer"></div>
                    <span className="text-md font-semibold">
                        {session?.user?.name}
                    </span>
                    </div>
                </Link>
            </>
        )}
        </div>
    </div>
  );
}
