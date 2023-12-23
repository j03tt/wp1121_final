import { eq, desc, isNull, sql, like, notIlike, and} from "drizzle-orm";
import { db } from "@/db";
import { likesTable, songsTable, usersTable } from "@/db/schema";

import useAuth from "@/hooks/useAuth";

import NewSongButton from "@/components/uploadSong";
import SignInButton from "@/components/SignInButton";
import SignOutButton from "@/components/SignOutButton";

export default async function Home() {
  const { auth } = useAuth();
  const session = await auth();

  return (
    <>
      <div className="flex h-screen w-full flex-col overflow-auto pt-2">

        {/* Header bar goes here */}
        <div className="flex flex-row items-center justify-between px-4 mb-4">
          <h1 className="bg-black px-4 text-xl font-bold text-center">Music!</h1>
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
                <div className="flex items-center gap-2">
                  {/* Profile page goes here (add a link) */}
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-400"></div>
                  <span className="text-md font-semibold">
                    {session?.user?.name}
                  </span>
                </div>
              </>
            )}
          </div>
        </div>
        
        {/* Main page goes here */}
      </div>
    </>
  );  
}
