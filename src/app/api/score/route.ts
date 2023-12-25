import { NextResponse, type NextRequest } from "next/server";

import { z } from "zod";

import { db } from "@/db";
import { scoresTable } from "@/db/schema";
import { and, eq } from "drizzle-orm";

const postScoreRequestSchema = z.object({
  songId: z.number().positive(),
  userName: z.string().min(1).max(50),
  score: z.number().positive(),
}); 

type postScoreRequest = z.infer<typeof postScoreRequestSchema>;

const putScoreRequestSchema = z.object({
  songId: z.number().positive(),
  userName: z.string().min(1).max(50),
  score: z.number().positive(),
}); 

type putScoreRequest = z.infer<typeof putScoreRequestSchema>;

const deleteScoreRequestSchema = z.object({
  songId: z.number().positive(),
  userId:z.number().positive(),
  userName: z.string().min(1).max(50),
}); 

type deleteScoreRequest = z.infer<typeof deleteScoreRequestSchema>;

export async function POST(request: NextRequest){
  const data = await request.json();

  try{
    postScoreRequestSchema.parse(data);
  }catch(error){
    return NextResponse.json({ error : "Invalid request."} );
  }

  const { songId, userName ,score } = data as postScoreRequest;

  try{
    await db
      .insert(scoresTable)
      .values({
        songId,
        userName,
        score: score.toString(),
      })
  }catch(error){
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }

  return new NextResponse("OK", { status: 200 });
}

export async function DELETE(request: NextRequest) {
  const data = await request.json();

  try {
    deleteScoreRequestSchema.parse(data);
  } catch (error) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const { songId, userName } = data as deleteScoreRequest;

  try {
    await db
      .delete(scoresTable)
      .where(
        and(
          eq(scoresTable.songId, songId),
          eq(scoresTable.userName, userName),
        ),
      )
      .execute();
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }

  return new NextResponse("OK", { status: 200 });
}

export async function PUT(request: NextRequest) {
  const data = await request.json();

  try {
    putScoreRequestSchema.parse(data);
  } catch (error) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const { songId, userName, score } = data as putScoreRequest;

  try {
    
    await db
      .update(scoresTable)
      .set({
        score: score.toString(),
      })
      .where(
        and(
          eq(scoresTable.songId, songId),
          eq(scoresTable.userName, userName),
        ),
      )
      .execute();
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }

  return new NextResponse("OK", { status: 200 });
}

