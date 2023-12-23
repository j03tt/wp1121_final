import { eq, desc, isNull, sql, like, notIlike, and} from "drizzle-orm";
import { db } from "@/db";
import { likesTable, songsTable, usersTable } from "@/db/schema";

import Link from "next/link";
import { publicEnv } from "@/lib/env/public";

import useAuth from "@/hooks/useAuth";

export default async function MainPage() {
  const { auth } = useAuth();
  const session = await auth();

  return (
    <div className="flex flex-row items-center justify-between px-4 mb-4">
        Main Page Goes Here
    </div>
  );  
}
