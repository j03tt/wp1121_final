import { eq, desc, isNull, sql, like, notIlike, and} from "drizzle-orm";
import { db } from "@/db";
import { likesTable, songsTable, usersTable } from "@/db/schema";
import NewSongButton from "@/components/uploadSong";

type HomePageProps = {
  searchParams: {
    username?: string;
  };
};

export default async function Home({
  searchParams: { username },
}: HomePageProps) {
  // if (username) {
  //   await db
  //     .insert(usersTable)
  //     .values({
  //       displayName: username,
  //       handle,
  //     })
  //     .onConflictDoUpdate({
  //       target: usersTable.handle,
  //       set: {
  //         displayName: username,
  //       },
  //     })
  //     .execute();
  // }
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

  // const tweets = await db
  //   .with(likesSubquery, likedSubquery)
  //   .select({
  //     id: tweetsTable.id,
  //     content: tweetsTable.content,
  //     username: usersTable.displayName,
  //     handle: usersTable.handle,
  //     likes: likesSubquery.likes,
  //     createdAt: tweetsTable.createdAt,
  //     liked: likedSubquery.liked,
  //   })
  //   .from(tweetsTable)
  //   .where(and(isNull(tweetsTable.replyToTweetId), (keyWord)? like(tweetsTable.content, `%${keyWord}%`) : notIlike(tweetsTable.content, `%${keyWord}%`)))
  //   .orderBy(desc(tweetsTable.createdAt))
  //   .innerJoin(usersTable, eq(tweetsTable.userHandle, usersTable.handle))
  //   .leftJoin(likesSubquery, eq(tweetsTable.id, likesSubquery.tweetId))
  //   .leftJoin(likedSubquery, eq(tweetsTable.id, likedSubquery.tweetId))
  //   .execute();

  return (
    <>
      <div className="flex h-screen w-full max-w-2xl flex-col overflow-scroll pt-2">
        <h1 className="mb-2 bg-white px-4 text-xl font-bold text-center">Join me!</h1>
          <NewSongButton></NewSongButton>
        {/* <div className="flex flex-col w-full content-center items-center px-4 pt-3">
          <ProfileButton />
        </div>
        <div className="w-full flex flex-row px-4 pt-3">
          <SearchBar />
          <NewActButton />
        </div>
        {tweets.map((tweet) => (
          <Tweet
            key={tweet.id}
            id={tweet.id}
            username={username}
            handle={handle}
            authorName={tweet.username}
            content={tweet.content}
            likes={tweet.likes}
            liked={tweet.liked}
            createdAt={tweet.createdAt!}
          />
        ))} */}
      </div>
      {/* <NameDialog /> */}
    </>
  );
}