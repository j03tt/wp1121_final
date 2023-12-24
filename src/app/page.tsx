import { eq, desc, isNull, sql, like, notIlike, and} from "drizzle-orm";
import { db } from "@/db";
import { likesTable, songsTable, usersTable } from "@/db/schema";
import NewSongButton from "@/components/uploadSong";
import Song from "@/components/Song";

type HomePageProps = {
  searchParams: {
    username?: string;
  };
};

export default async function Home({
  searchParams: { username },
}: HomePageProps) {
  // const likesSubquery = db.$with("likes_count").as(
  //   db
  //     .select({
  //       tweetId: likesTable.tweetId,
  //       likes: sql<number | null>`count(*)`.mapWith(Number).as("likes"),
  //     })
  //     .from(likesTable)
  //     .groupBy(likesTable.tweetId),
  // );

  // const likedSubquery = db.$with("liked").as(
  //   db
  //     .select({
  //       tweetId: likesTable.tweetId,
  //       liked: sql<number>`1`.mapWith(Boolean).as("liked"),
  //     })
  //     .from(likesTable)
  //     .where(eq(likesTable.userHandle, handle ?? "")),
  // );

  const songs = await db
    // .with(likesSubquery, likedSubquery)
    .select({
      id: songsTable.id,
      userId: songsTable.userId,
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
    <>
      <div className="flex h-screen w-full max-w-2xl flex-col overflow-scroll pt-2">
        {/* <h1 className="mb-2 bg-white px-4 text-xl font-bold text-center">Join me!</h1>
          <NewSongButton></NewSongButton>
        <div className="flex flex-col w-full content-center items-center px-4 pt-3">
          <ProfileButton />
        </div>
        <div className="w-full flex flex-row px-4 pt-3">
          <SearchBar />
          <NewActButton />
        </div> */}
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
      {/* <NameDialog /> */}
    </>
  );
}