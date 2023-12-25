import useAuth from "@/hooks/useAuth";
import Song from "@/components/Song";
import HeaderBar from "@/components/HeaderBar";
import MainPage from "@/components/MainPage";
import { Separator } from "@/components/ui/separator";
import useUserInfo from "@/hooks/useUserInfo";
import { eq, desc, isNull, sql, like, notIlike, and} from "drizzle-orm";
import { db } from "@/db";
import { likesTable, songsTable, usersTable } from "@/db/schema";

type HomePageProps = {
  searchParams: {
    username?: string;
  };
};

export default async function Home({
  searchParams: { username },
}: HomePageProps) {
  const { auth } = useAuth();
  const session = await auth();
  
  const songs = await db
    // .with(likesSubquery, likedSubquery)
    .select({
      id: songsTable.id,
      userName: songsTable.userName,
      avgScore: songsTable.avgScore,
      reviewers: songsTable.reviewers,
      songName: songsTable.songName,
      singerName: songsTable.singerName,
      image: songsTable.thumbnail
    })
    .from(songsTable)
    .orderBy(desc(songsTable.createdAt))
    .execute();
  return (
    <div className="flex h-screen w-full flex-col overflow-auto pt-2">
      <HeaderBar />
      <Separator />
      <div className="flex flex-col items-center justify-between px-4 mb-4">
          Main Page Goes Here
          <div className="flex h-screen w-full max-w-2xl flex-col overflow-scroll pt-2">
          <h1 className="mb-2 bg-grey px-4 text-xl font-bold text-center">SongList</h1>
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
        </div>
      </div>
    </div>
  );
}
