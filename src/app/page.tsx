import { auth } from "@/hooks/useAuth";
import Song from "@/components/Song";
import HeaderBar from "@/components/HeaderBar";
import SearchBar from "@/components/SearchBar";
import Filter from "@/components/Filter";
import { Separator } from "@/components/ui/separator";
import useUserInfo from "@/hooks/useUserInfo";
import { eq, asc, desc, isNull, sql, like, notIlike, and} from "drizzle-orm";
import { db } from "@/db";
import { likesTable, songsTable, usersTable } from "@/db/schema";

type HomePageProps = {
  searchParams: {
    keyWord?: string;
    Filter?: string;
  };
};

export default async function Home({
  searchParams: { keyWord, Filter },
}: HomePageProps) {
  // const { auth } = useAuth();
  const session = await auth();
  const username = session?.user?.name;
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
    .where((keyWord)? like(songsTable.songName, `%${keyWord}%`) : notIlike(songsTable.songName, `%${keyWord}%`))
    .orderBy((!Filter || Filter === "0")? desc(songsTable.createdAt) : 
             (Filter === "1")? asc(songsTable.createdAt) : 
             (Filter === "2")? desc(songsTable.avgScore) : 
             asc(songsTable.avgScore))
    .execute();
  return (
    <div className="flex h-screen w-full flex-col overflow-auto pt-2">
      <HeaderBar />
      <Separator />
      <div className="flex flex-col w-full items-center justify-between px-4 mb-4">
        {/* <SearchBar /> */}
        <div className="flex flex-wrap h-screen w-full flex-row pt-2">
          {songs.map((song) => (
              <Song
                key={song.id}
                id={song.id}
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
