import { NextResponse, type NextRequest } from "next/server";

import { z } from "zod";

import { db } from "@/db";
import { scoresTable } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { da } from "@faker-js/faker";

const postCommentRequestSchema = z.object({
  songId: z.number().positive(),
  userId: z.number().positive(),
  score: z.number(),
}); 

type postCommentRequest = z.infer<typeof postCommentRequestSchema>;


const deleteCommentRequestSchema = z.object({
  songId: z.number().positive(),
  userId:z.number().positive(),
}); 

type deleteCommentRequest = z.infer<typeof deleteCommentRequestSchema>;

export async function POST(request: NextRequest){
  const data = await request.json();

  try{
    postCommentRequestSchema.parse(data);
  }catch(error){
    return NextResponse.json({ error : "Invalid request."} );
  }

  const { songId, userId, score } = data as postCommentRequest;

  try{
    await db
      .insert(scoresTable)
      .values({
        songId,
        userId,
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
    deleteCommentRequestSchema.parse(data);
  } catch (error) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const { songId, userId } = data as deleteCommentRequest;

  try {
    await db
      .delete(scoresTable)
      .where(
        and(
          eq(scoresTable.songId, songId),
          eq(scoresTable.userId, userId),
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


