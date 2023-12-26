import { NextResponse, type NextRequest } from "next/server";

import { z } from "zod";

import { db } from "@/db";
import { usersTable } from "@/db/schema";
import { eq } from "drizzle-orm";

const putBiographyRequestSchema = z.object({
  userId: z.number().positive(),
  bio: z.string().max(300),
}); 

type putBiographyRequest = z.infer<typeof putBiographyRequestSchema>;


export async function PUT(request: NextRequest) {
  const data = await request.json();

  try {
    putBiographyRequestSchema.parse(data);
  } catch (error) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const { userId, bio } = data as putBiographyRequest;

  try {
    
    await db
      .update(usersTable)
      .set({
        bio,
      })
      .where(eq(usersTable.id, userId))
      .execute();
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }

  return new NextResponse("OK", { status: 200 });
}
