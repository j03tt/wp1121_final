import { eq, desc, isNull, sql, like, notIlike, and} from "drizzle-orm";
import { db } from "@/db";
import { likesTable, songsTable, usersTable } from "@/db/schema";
import Song from "@/components/Song";
import Link from "next/link";
import { publicEnv } from "@/lib/env/public";
import useAuth from "@/hooks/useAuth";
import useUserInfo from "@/hooks/useUserInfo";
import useSong from "@/hooks/useSong";

const {username} = useUserInfo();

export default async function MainPage() {
  const { auth } = useAuth();
  const session = await auth();
  const {getSong, postSong, putSong} = useSong();
  const songs = getSong();
  return (
    <div className="flex flex-row items-center justify-between px-4 mb-4">
        Main Page Goes Here
        {/* <div className="flex h-screen w-full max-w-2xl flex-col overflow-scroll pt-2">
        <h1 className="mb-2 bg-white px-4 text-xl font-bold text-center">Join me!</h1>
        {songs.map((song) => (
          <Song
            key={song.id}
            id={song.id}
            username={username!}
            songTitle={song.songName}
            singer={song.singerName}
            reviewers={song.reviewers}
            score={song.avgScore}
            image={song.image}
          />
        ))}
      </div> */}
    </div>
  );  
}