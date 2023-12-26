import Link from "next/link";
import useAuth from "@/hooks/useAuth";
import { redirect } from "next/navigation";
import { useSession } from "next-auth/react";
import { eq, desc, and } from "drizzle-orm";
import Rating from '@mui/material/Rating';
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
    console.log("uwu", song_id)
    redirect(`/?${params.toString()}`);
  };
  const { auth } = useAuth();
  const session = await auth();
  const username = session?.user?.name;
  //if(!username) return;
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

  const [userScore] = (username)? await db
    .select({
      score: scoresTable.score
    })
    .from(scoresTable)
    .where(and(eq(scoresTable.songId, song_id_num), eq(scoresTable.userName, username!)))
    .execute() : [];
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
  };


  return (
    <>
      <div className="mb-2 flex items-center w-1/2 gap-8 px-4">
        <Link href={{ pathname: "/", query: { username } }}>
          <ArrowLeft className="mt-4" size={32} />
        </Link>
        <h1 className="text-3xl mt-4 font-bold text-center">Back to Menu</h1>
      </div>
      <div className="flex h-screen w-full flex-col overflow-hidden pt-2 items-center">
        <div className="flex h-screen w-1/2 flex-col overflow-auto pt-2 items-center border-2 gap-2">
          <div className="flex flex-col justify-between items-center px-4 pt-3 w-full gap-3">
            <div className="flex w-full gap-3 flex-row">
              <img src={song.thumbnail} alt="Song image Src" className="w-1/3"/>
              <div className="flex flex-col justify-around w-full gap-2">
                <div className="flex flex-row gap-1 justify-between items-center">
                  <p className="font-bold text-3xl">{song.songName ?? "..."}</p>
                  <p className="font-bold text-xs">Uploader - {song.username ?? "..."}</p>
                </div>
                <p className="font-bold text-xl">{song.singerName ?? "..."}</p>
                <div className="flex items-center gap-2">
                  <Rating name="read-only" value={parseFloat(song.avgScore)} precision={0.5} readOnly  />
                  <p>{song.avgScore ?? "..."}</p>
                  <p>({song.reviewers} user(s) had rated!)</p>
                </div>
                <Link href={song.songLink ?? "..."} className="underline underline-offset-1 text-blue-700">Click to Listen</Link>
                
              </div>
            </div>
            <Separator />

            {/* <p className="font-bold text-xl text-left w-full"><a href={song.songLink ?? "..."}>{song.songLink ?? "..."}</a></p> */}
            <div className="flex w-full gap-2 items-center">
              {username !== null && (
                <p className="font-bold text-lg w-full text-end">Rate this song!</p>
              )}
              { (username)? (
                (userScore)?<RateStar replyToSongId={song.id} userScore={userScore.score} CurrentScore={song.avgScore} CurrentNum={song.reviewers}></RateStar> : 
                <RateStar replyToSongId={song.id} userScore={""} CurrentScore={song.avgScore} CurrentNum={song.reviewers}></RateStar>
              ) : (<p className="font-bold text-lg w-full p-1">Please login to rate the song</p>)
              }
            </div>

            {(username)? <ReplyInput replyToSongId={song.id}></ReplyInput> : <p className="font-bold text-lg w-full text-center p-1">Please login to comment</p>}
            
          </div>
          <Separator />
          {replies.map((reply) => (
            <Reply
              key={reply.id}
              id={reply.id}
              authorName={reply.userName}
              content={reply.content??""}
              createdAt={reply.createAt!}
            />
          ))}
        </div>
      </div>
    </>
  );
}
