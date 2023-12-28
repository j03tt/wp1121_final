import Link from "next/link";
import Image from "next/image";
import { auth } from "@/hooks/useAuth";
import { redirect } from "next/navigation";
// import { useSession } from "next-auth/react";
import { eq, asc, desc, sql, like, notIlike, and} from "drizzle-orm";
import Rating from '@mui/material/Rating';
import {
  ArrowLeft,
  // MoreHorizontal,
  // Share,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import FilterReply from "@/components/FilterReply";
import ReplyInput from "@/components/ReplyInput";
import RateStar from "@/components/Star";
import Reply from "@/components/Reply";
import { db } from "@/db";
import { commentsTable, dislikesTable, likesTable, songsTable, usersTable, scoresTable } from "@/db/schema";

type SongPageProps = {
  params: {
    song_id: string;
  };
  searchParams: {
    username?: string;
    Filter?: string;
  };
};
export default async function SongPage({
  params: { song_id },
  searchParams: { Filter },
}: SongPageProps) {
  const errorRedirect = () => {
    const params = new URLSearchParams();
    console.log("uwu", song_id)
    redirect(`/?${params.toString()}`);
  };
  // const { auth } = useAuth();
  const session = await auth();
  const username = session?.user?.name;
  //if(!username) return;
  //console.log(Filter)
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

  const likesSubquery = db.$with("likes_count").as(
    db
      .select({
        commentId: likesTable.commentId,
        likes: sql<number | null>`count(*)`.mapWith(Number).as("likes"),
      })
      .from(likesTable)
      .groupBy(likesTable.commentId),
  );

  const likedSubquery = db.$with("liked").as(
    db
      .select({
        commentId: likesTable.commentId,
        liked: sql<number>`1`.mapWith(Boolean).as("liked"),
      })
      .from(likesTable)
      .where(eq(likesTable.userName, username ?? "")),
  );

  const dislikesSubquery = db.$with("dislikes_count").as(
    db
      .select({
        commentId: dislikesTable.commentId,
        dislikes: sql<number | null>`count(*)`.mapWith(Number).as("dislikes"),
      })
      .from(dislikesTable)
      .groupBy(dislikesTable.commentId),
  );

  const dislikedSubquery = db.$with("disliked").as(
    db
      .select({
        commentId: dislikesTable.commentId,
        disliked: sql<number>`1`.mapWith(Boolean).as("disliked"),
      })
      .from(dislikesTable)
      .where(eq(dislikesTable.userName, username ?? "")),
  );

  const [userScore] = (username)? await db
    .select({
      score: scoresTable.score
    })
    .from(scoresTable)
    .where(and(eq(scoresTable.songId, song_id_num), eq(scoresTable.userName, username!)))
    .execute() : [];

    var replies = await db
    .with(likesSubquery, likedSubquery, dislikesSubquery, dislikedSubquery)
    .select({
      id: commentsTable.id,
      content: commentsTable.content,
      userName: commentsTable.userName,
      createAt: commentsTable.createdAt,
      likes: sql<number>`COALESCE(${likesSubquery.likes}, 0)`.mapWith(Number).as("likes"),
      liked: likedSubquery.liked,
      dislikes: sql<number>`COALESCE(${dislikesSubquery.dislikes}, 0)`.mapWith(Number).as("dislikes"),
      disliked: dislikedSubquery.disliked,
      score: scoresTable.score,
    })
    .from(commentsTable)
    .where(eq(commentsTable.songId, song_id_num))
    .orderBy((!Filter || Filter === "0")? desc(commentsTable.createdAt) : 
    (Filter === "1")? asc(commentsTable.createdAt) : 
    (Filter === "2")? desc(scoresTable.score) : 
    (Filter === "3")? asc(scoresTable.score) : 
    (Filter === "4")? desc(likesSubquery.likes) : 
    desc(dislikesSubquery.dislikes))
    .leftJoin(scoresTable, eq(commentsTable.userName, scoresTable.userName))
    .leftJoin(likesSubquery, eq(commentsTable.id, likesSubquery.commentId))
    .leftJoin(likedSubquery, eq(commentsTable.id, likedSubquery.commentId))
    .leftJoin(dislikesSubquery, eq(commentsTable.id, dislikesSubquery.commentId))
    .leftJoin(dislikedSubquery, eq(commentsTable.id, dislikedSubquery.commentId))
    .execute();
  if (!songData) {
    errorRedirect();
  }
  
  setInterval(async () => {
    replies = await db
    .with(likesSubquery, likedSubquery, dislikesSubquery, dislikedSubquery)
    .select({
      id: commentsTable.id,
      content: commentsTable.content,
      userName: commentsTable.userName,
      createAt: commentsTable.createdAt,
      likes: likesSubquery.likes,
      liked: likedSubquery.liked,
      dislikes: dislikesSubquery.dislikes,
      disliked: dislikedSubquery.disliked,
      score: scoresTable.score,
    })
    .from(commentsTable)
    .where(eq(commentsTable.songId, song_id_num))
    .orderBy((!Filter || Filter === "0")? desc(commentsTable.createdAt) : 
    (Filter === "1")? asc(commentsTable.createdAt) : 
    (Filter === "2")? desc(scoresTable.score) : 
    (Filter === "3")? asc(scoresTable.score) : 
    (Filter === "4")? desc(likesSubquery.likes) : 
    desc(dislikesSubquery.dislikes))
    .leftJoin(scoresTable, eq(commentsTable.userName, scoresTable.userName))
    .leftJoin(likesSubquery, eq(commentsTable.id, likesSubquery.commentId))
    .leftJoin(likedSubquery, eq(commentsTable.id, likedSubquery.commentId))
    .leftJoin(dislikesSubquery, eq(commentsTable.id, dislikesSubquery.commentId))
    .leftJoin(dislikedSubquery, eq(commentsTable.id, dislikedSubquery.commentId))
    .execute();
  if (!songData) {
    errorRedirect();
  }
  }, 5000)
  console.log(replies.length)
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
      <div className="flex flex-row w-full justify-between">
        <div className="mb-2 flex items-center w-1/2 gap-8 px-4">
          <Link href={{ pathname: "/", query: { username } }}>
            <ArrowLeft className="mt-4" size={32} />
          </Link>
          <h3 className="text-lg mt-4 font-bold text-center">Back to Menu</h3>
        </div>
        <FilterReply></FilterReply>
      </div>
      
      <div className="flex h-max w-full flex-col overflow-hidden pt-2 items-center">
        <div className="flex h-max w-1/2 flex-col overflow-auto pt-2 items-center border-2 gap-2">
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
              currentUser={username!}
              likes={reply.likes}
              liked={reply.liked}
              dislikes={reply.dislikes}
              disliked={reply.disliked}
              score={reply.score!}
            />
          ))}
        </div>
      </div>
    </>
  );
}
