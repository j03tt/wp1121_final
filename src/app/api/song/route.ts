import { NextResponse, type NextRequest } from "next/server";

import { z } from "zod";

import { db } from "@/db";
import { songsTable } from "@/db/schema";
import { desc, like, eq } from "drizzle-orm";

const postSongRequestSchema = z.object({
  userName: z.string().min(1).max(50),
  songName: z.string().min(1).max(50),
  singerName: z.string().min(1).max(50),
  songLink: z.string().min(1).max(150),
  reviewers: z.number().positive(),
  score: z.number().positive(),
  thumbnail: z.string().min(1).max(150),
}); 

type postSongRequest = z.infer<typeof postSongRequestSchema>;

const putSongRequestSchema = z.object({
  songId: z.number().positive(),
  reviewers: z.number().positive(),
  score: z.number().positive(),
}); 

type putSongRequest = z.infer<typeof putSongRequestSchema>;

export async function POST(request: NextRequest) {
  const data = await request.json();

  try {
    postSongRequestSchema.parse(data);
  } catch (error) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const { userName, songName, singerName, songLink, reviewers, score, thumbnail } = data as postSongRequest;

  try {
    
    await db
      .insert(songsTable)
      .values({
        uploadUser: userName,
        avgScore: score.toString(),
        reviewers: reviewers,
        songName: songName,
        singerName: singerName,
        songLink: songLink,
        thumbnail: thumbnail,
      })
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }

  return new NextResponse("OK", { status: 200 });
}

export async function GET(){
  // console.log("Hello!")
  try {
    const [song] = await db
      .select({
        username: songsTable.uploadUser,
        songName: songsTable.songName,
        singerName: songsTable.singerName,
        songLink: songsTable.songLink,
        thumbnail: songsTable.thumbnail,
        reviewer: songsTable.reviewers,
        score: songsTable.avgScore,
      })
      .from(songsTable)
      .orderBy(desc(songsTable.createdAt))
      .limit(1)
      .execute()

    return NextResponse.json(song);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const data = await request.json();

  try {
    putSongRequestSchema.parse(data);
  } catch (error) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const { songId, reviewers, score } = data as putSongRequest;

  try {
    
    await db
      .update(songsTable)
      .set({
        reviewers,
        avgScore: score.toString(),
      })
      .where(eq(songsTable.id, songId))
      .execute();
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }

  return new NextResponse("OK", { status: 200 });
}
