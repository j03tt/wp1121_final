import Link from "next/link";
import { redirect } from "next/navigation";

import { eq, desc, and } from "drizzle-orm";
import {
  ArrowLeft,
  MoreHorizontal,
  Share,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import Reply from "@/components/Reply";
import { db } from "@/db";
import { commentsTable, likesTable, songsTable, usersTable } from "@/db/schema";

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
  searchParams: { username },
}: SongPageProps) {
  const errorRedirect = () => {
    const params = new URLSearchParams();
    username && params.set("username", username);
    redirect(`/?${params.toString()}`);
  };
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
    })
    .from(songsTable)
    .where(eq(songsTable.id, song_id_num))
    .execute();
  if (!songData) {
    errorRedirect();
  }

  var replies = await db
    .select({
      id: commentsTable.id,
      content: commentsTable.content,
      userName: usersTable.name,
      createAt: commentsTable.createdAt
    })
    .from(commentsTable)
    .where(and(eq(songsTable.id, song_id_num), eq(commentsTable.userId, usersTable.displayId)))
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
        userName: usersTable.name,
        createAt: commentsTable.createdAt
      })
      .from(commentsTable)
      .where(and(eq(songsTable.id, song_id_num), eq(commentsTable.userId, usersTable.displayId)))
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
      <div className="flex h-screen w-full max-w-2xl flex-col overflow-scroll pt-2">
        <div className="mb-2 flex items-center gap-8 px-4">
          <Link href={{ pathname: "/", query: { username } }}>
            <ArrowLeft size={18} />
          </Link>
          <h1 className="text-xl font-bold">Song</h1>
        </div>
        <div className="flex flex-col px-4 pt-3">
          <div className="flex justify-between">
            <div className="flex w-full gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <div>
                <p className="font-bold">
                  Song title: @{song.songName ?? "..."}
                  {/* <time className="my-4 block text-sm text-gray-500">
                     wrote at 
                    <TimeText date={tweet.createdAt} format="h:mm A · D MMM YYYY" /> :
                  </time> */}
                </p>
                <p className="font-bold">Singer: {song.singerName ?? "..."}</p>
              </div>
            </div>
            <button className="h-fit rounded-full p-2.5 text-gray-400 transition-colors duration-300 hover:bg-brand/10 hover:text-brand">
              <MoreHorizontal size={16} />
            </button>
          </div>
          <Separator />
          <div className="my-2 flex items-center justify-between gap-4 text-gray-400">
            <button className="rounded-full p-1.5 transition-colors duration-300 hover:bg-brand/10 hover:text-brand">
              <Share size={18} />
            </button>
          </div>
          <Separator />
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
    </>
  );
}
