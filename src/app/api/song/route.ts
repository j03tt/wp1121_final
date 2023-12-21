import { NextResponse, type NextRequest } from "next/server";

import { z } from "zod";

import { db } from "@/db";
import { songsTable } from "@/db/schema";
import { desc, like, eq } from "drizzle-orm";

const postSongRequestSchema = z.object({
  userId: z.number().positive(),
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

  const { userId, songName, singerName, songLink, reviewers, score, thumbnail } = data as postSongRequest;

  try {
    
    await db
      .insert(songsTable)
      .values({
        userId,
        songName,
        singerName,
        songLink,
        reviewers,
        score,
        thumbnail,
      })
      .execute();
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
    const [activity] = await db
      .select({
        id: songsTable.id,
        // activityName: activitiesTable.activityName,
      })
      .from(songsTable)
      .orderBy(desc(songsTable.createdAt))
      .limit(1)
      .execute()

    console.log("Route: ", activity)
    return NextResponse.json(activity);
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
        score,
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
