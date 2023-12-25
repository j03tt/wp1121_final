import { NextResponse, type NextRequest } from "next/server";

import { z } from "zod";

import { db } from "@/db";
import { commentsTable } from "@/db/schema";
import { desc, like, eq } from "drizzle-orm";
import { da } from "@faker-js/faker";

const postCommentRequestSchema = z.object({
  songId: z.number().positive(),
  userName: z.string().min(1).max(50),
  content: z.string().min(1).max(300),
}); 

type postCommentRequest = z.infer<typeof postCommentRequestSchema>;


const deleteCommentRequestSchema = z.object({
  commentId: z.number().positive()
}); 

type deleteCommentRequest = z.infer<typeof deleteCommentRequestSchema>;

export async function POST(request: NextRequest){
  const data = await request.json();

  try{
    postCommentRequestSchema.parse(data);
  }catch(error){
    return NextResponse.json({ error : "Invalid request."} );
  }

  const { songId, userName, content } = data as postCommentRequest;

  try{
    await db
      .insert(commentsTable)
      .values({
        songId,
        userName,
        content
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

  const { commentId } = data as deleteCommentRequest;

  try {
    await db
      .delete(commentsTable)
      .where(
        eq(commentsTable.id, commentId)
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


