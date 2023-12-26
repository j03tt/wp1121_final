import { NextResponse, type NextRequest } from "next/server";

import { and, eq, sql } from "drizzle-orm";
import { z } from "zod";

import { db } from "@/db";
import { dislikesTable } from "@/db/schema";

const dislikeRequestSchema = z.object({
  userName: z.string().min(1).max(50),
  commentId: z.number().positive(),
});

type dislikeRequest = z.infer<typeof dislikeRequestSchema>;

export async function GET(request: NextRequest) {
  const data = await request.json();

  try {
    dislikeRequestSchema.parse(data);
  } catch (error) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  
  const { userName, commentId } = data as dislikeRequest;

  try {
    
    const [exist] = await db
      .select({ dummy: sql`1` })
      .from(dislikesTable)
      .where(
        and(
          eq(dislikesTable.userName, userName),
          eq(dislikesTable.commentId, commentId),
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
    dislikeRequestSchema.parse(data);
  } catch (error) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const { userName, commentId } = data as dislikeRequest;

  try {
    await db
      .insert(dislikesTable)
      .values({
        userName,
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
    dislikeRequestSchema.parse(data);
  } catch (error) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const { userName, commentId } = data as dislikeRequest;

  try {
    await db
      .delete(dislikesTable)
      .where(
        and(
          eq(dislikesTable.userName, userName),
          eq(dislikesTable.commentId, commentId),
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
