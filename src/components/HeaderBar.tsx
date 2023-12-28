import Link from "next/link";
import { publicEnv } from "@/lib/env/public";

import { auth } from "@/hooks/useAuth";
import Filter from "./Filter";
import NewSongButton from "@/components/uploadSong";
import SignInButton from "@/components/SignInButton";
import SignOutButton from "@/components/SignOutButton";
import MyAccountButton from "@/components/MyAccountButton";
import SearchBar from "@/components/SearchBar";

export default async function HeaderBar() {
//   const { auth } = useAuth();
  const session = await auth();
  const user_id = session?.user?.id;

  return (
    <div className="flex flex-row items-center justify-between px-4 mb-2">
        <Link href={`${publicEnv.NEXT_PUBLIC_BASE_URL}`}>
            <h1 className="px-4 text-xl font-bold text-center">Capture Your Music!</h1>
        </Link>
        <SearchBar />
        <div className="flex items-center gap-4">
            <Filter />
            {!session?.user?.id ? (
                <SignInButton />
            ) : (
                <div className="flex flex-row items-center gap-2">
                    <NewSongButton />
                    <SignOutButton />
                    <MyAccountButton userName={ session.user.name }/>
                </div>
            )}
        </div>
    </div>
  );
}
