import Link from "next/link";
import useAuth from "@/hooks/useAuth";
import { redirect } from "next/navigation";
import { useSession } from "next-auth/react";
import { eq, desc, and } from "drizzle-orm";
import {
  ArrowLeft,
  MoreHorizontal,
  Share,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import ReplyInput from "@/components/ReplyInput";
import RateStar from "@/components/Star";
import Reply from "@/components/Reply";
import { db } from "@/db";
import { commentsTable, likesTable, songsTable, usersTable, scoresTable } from "@/db/schema";

type SongPageProps = {
  params: {
    song_id: string;
  };
  searchParams: {
    username?: string;
  };
};
export default async function SongPage({
  params: { song_id },
}: SongPageProps) {
  const errorRedirect = () => {
    const params = new URLSearchParams();
    redirect(`/?${params.toString()}`);
  };
  const { auth } = useAuth();
  const session = await auth();
  const username = session?.user?.name;
  if(!username) return;
  const song_id_num = parseInt(song_id);
  if (isNaN(song_id_num)) {
    errorRedirect();
  }
  const [songData] = await db
    .select({
      id: songsTable.id,
      songName: songsTable.songName,
      singerName: songsTable.singerName,
      songLink: songsTable.songLink,
      thumbnail: songsTable.thumbnail,
      avgScore: songsTable.avgScore,
      reviewers: songsTable.reviewers,
      username: songsTable.userName,
    })
    .from(songsTable)
    .where(eq(songsTable.id, song_id_num))
    .execute();
  if (!songData) {
    errorRedirect();
  }

  const [userScore] = await db
    .select({
      score: scoresTable.score
    })
    .from(scoresTable)
    .where(and(eq(scoresTable.songId, song_id_num), eq(scoresTable.userName, username)))
    .execute()
  console.log("owoowowowowowow:"+username)

  var replies = await db
    .select({
      id: commentsTable.id,
      content: commentsTable.content,
      userName: commentsTable.userName,
      createAt: commentsTable.createdAt
    })
    .from(commentsTable)
    .where(eq(commentsTable.songId, song_id_num))
    .orderBy(desc(commentsTable.createdAt))
    .execute();
  if (!songData) {
    errorRedirect();
  }
  
  setInterval(async () => {
    replies = await db
    .select({
      id: commentsTable.id,
      content: commentsTable.content,
      userName: commentsTable.userName,
      createAt: commentsTable.createdAt
    })
    .from(commentsTable)
    .where(eq(commentsTable.songId, song_id_num))
    .orderBy(desc(commentsTable.createdAt))
    .execute();
  if (!songData) {
    errorRedirect();
  }
  }, 5000)

  const song = {
    id: songData.id,
    songName: songData.songName,
    singerName: songData.singerName,
    songLink: songData.songLink,
    thumbnail: songData.thumbnail,
    avgScore: songData.avgScore,
    reviewers: songData.reviewers,
    username: songData.username
    //username: user.displayName,
    //handle: user.handle,
    //likes: numLikes,
    //createdAt: tweetData.createdAt,
    //liked: Boolean(liked),
    //fromDate: tweetData.fromDate,
    //toDate: tweetData.toDate,
  };


  return (
    <>
      <div className="mb-2 flex items-center w-1/2 gap-8 px-4">
        <Link href={{ pathname: "/", query: { username } }}>
          <ArrowLeft size={32} />
        </Link>
        <h1 className="text-3xl mt-4 font-bold text-center">Back to Menu</h1>
      </div>
      <div className="flex h-screen w-full flex-col overflow-hidden pt-2 items-center">
        <div className="flex h-screen w-1/2 flex-col overflow-hidden pt-2 items-center border-2">
          <div className="flex flex-col justify-between items-center px-4 pt-3 w-full">
            <div className="flex w-full gap-3 flex-row">
              <img src={song.thumbnail} alt="Song image Src" className="w-1/3"/>
              <div className="flex flex-col justify-around w-full">
                <p className="font-bold text-xl">Title: {song.songName ?? "..."}</p>
                <p className="font-bold text-xl">Singer: {song.singerName ?? "..."}</p>
                <p className="font-bold text-xl">Score: {song.avgScore ?? "..."} ({song.reviewers} user(s) had rated!)</p>
                <p className="font-bold text-xl">Uploaded By: {song.username ?? "..."}</p>
              </div>
            </div>
            <Separator />
            <p className="font-bold text-xl">Song Link
            : <a href={song.songLink ?? "..."}>{song.songLink ?? "..."}</a>
            </p>
            <p>Rate this song!</p>

            
            {(userScore)?<RateStar replyToSongId={song.id} userScore={userScore.score} CurrentScore={song.avgScore} CurrentNum={song.reviewers}></RateStar> : 
            <RateStar replyToSongId={song.id} userScore={""} CurrentScore={song.avgScore} CurrentNum={song.reviewers}></RateStar>}
            <ReplyInput replyToSongId={song.id}></ReplyInput>
          </div>
          <Separator />
          {replies.map((reply) => (
            <Reply
              key={reply.id}
              id={reply.id}
              authorName={reply.userName}
              content={reply.content??""}
              createdAt={reply.createAt!}
              // liked={reply.}
              // likes,
              // disliked,
              // dislikes,
            />
          ))}
        </div>
      </div>
    </>
  );
}