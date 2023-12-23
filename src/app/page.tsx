import { eq, desc, isNull, sql, like, notIlike, and} from "drizzle-orm";
import { db } from "@/db";
import { likesTable, songsTable, usersTable } from "@/db/schema";

import Link from "next/link";
import { publicEnv } from "@/lib/env/public";

import useAuth from "@/hooks/useAuth";

import NewSongButton from "@/components/uploadSong";
import SignInButton from "@/components/SignInButton";
import SignOutButton from "@/components/SignOutButton";
import HeaderBar from "@/components/HeaderBar";
import MainPage from "@/components/MainPage";
import ProfilePage from "@/components/ProfilePage";

export default async function Home() {
  const { auth } = useAuth();
  const session = await auth();

  return (
    <div className="flex h-screen w-full flex-col overflow-auto pt-2">
      <HeaderBar />
      <MainPage />
    </div>
  );
}
