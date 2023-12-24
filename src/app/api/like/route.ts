import { NextResponse, type NextRequest } from "next/server";

import { and, eq, sql } from "drizzle-orm";
import { z } from "zod";

import { db } from "@/db";
import { likesTable } from "@/db/schema";

const likeRequestSchema = z.object({
  userId: z.number().positive(),
  commentId: z.number().positive(),
});

type likeRequest = z.infer<typeof likeRequestSchema>;

export async function GET(request: NextRequest) {
  const data = await request.json();

  try {
    likeRequestSchema.parse(data);
  } catch (error) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  
  const { userId, commentId } = data as likeRequest;

  try {
    
    const [exist] = await db
      .select({ dummy: sql`1` })
      .from(likesTable)
      .where(
        and(
          eq(likesTable.userId, userId),
          eq(likesTable.commentId, commentId),
        ),
      )
      .execute();
    // The NextResponse object is a easy to use API to handle responses.
    // IMHO, it's more concise than the express API.
    return NextResponse.json({ liked: Boolean(exist) }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  const data = await request.json();

  try {
    likeRequestSchema.parse(data);
  } catch (error) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const { userId, commentId } = data as likeRequest;

  try {
    await db
      .insert(likesTable)
      .values({
        userId,
        commentId,
      })
      .onConflictDoNothing()
      .execute();
  } catch (error) {
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
    likeRequestSchema.parse(data);
  } catch (error) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const { userId, commentId } = data as likeRequest;

  try {
    await db
      .delete(likesTable)
      .where(
        and(
          eq(likesTable.userId, userId),
          eq(likesTable.commentId, commentId),
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
