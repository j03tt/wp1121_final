import useAuth from "@/hooks/useAuth";

import { db } from "@/db";
import { usersTable, songsTable, scoresTable } from "@/db/schema";
import { eq, and } from "drizzle-orm";

import { publicEnv } from "@/lib/env/public";
import { redirect } from "next/navigation";

import HeaderBar from "@/components/HeaderBar";
// import { Button } from "@/components/ui/button";

type ProfilePageProps = {
    params: {
      // this came from the file name: [user_id].tsx
      user_id: string;
    };
};

export default async function ProfilePage({
    params: { user_id },
}: ProfilePageProps) {
	const { auth } = useAuth();
    const session = await auth();

    const errorRedirect = () => {
        redirect(`${publicEnv.NEXT_PUBLIC_BASE_URL}`);
    };
    if (!session) errorRedirect();

    const [userData] = await db
        .select({
            id: usersTable.id,
            display_id: usersTable.displayId,
            name: usersTable.name,
            email: usersTable.email,
            bio: usersTable.bio, // [editable!]
        })
        .from(usersTable)
        .where(eq(usersTable.displayId, user_id))
        .execute();
    if (!userData) errorRedirect();
    console.log(userData);

    const [uploadedSongsData] = await db
        .select({
            user_id: songsTable.userId,
            song_id: songsTable.id,
            song_name: songsTable.songName,
            singer_name: songsTable.singerName,
            song_link: songsTable.songLink,
            created_at: songsTable.createdAt,
            thumbnail: songsTable.thumbnail,
        })
        .from(songsTable)
        .where(eq(songsTable.userId, userData.id))
        .execute();
    if (!uploadedSongsData) console.log("# uploaded songs: 0 or null");

    const [reviewedSongsData] = await db
        .select({
            user_id: scoresTable.userId,
            song_id: scoresTable.songId,
            score: scoresTable.score,
            created_at: scoresTable.createdAt,
            song_name: songsTable.songName,
            singer_name: songsTable.singerName,
            song_link: songsTable.songLink,
        })
        .from(scoresTable)
        .innerJoin(songsTable, and(eq(songsTable.userId, scoresTable.userId), eq(songsTable.id, scoresTable.songId)))
        .where(eq(scoresTable.userId, userData.id))
        .execute();
    if (!reviewedSongsData) console.log("# reviewed songs: 0 or null");

	return (
		<div className="flex h-screen w-full flex-col overflow-auto pt-2">
			<HeaderBar />
			
			<div className="flex flex-row items-center justify-between px-4 mb-4">
                Profile Page Goes Here, name = {userData.name}
            </div>
		</div>
	);
}
