import Link from "next/link";
import { auth } from "@/hooks/useAuth";

import { db } from "@/db";
import { usersTable, songsTable, scoresTable } from "@/db/schema";
import { eq } from "drizzle-orm";

import { publicEnv } from "@/lib/env/public";
import { redirect } from "next/navigation";

import HeaderBar from "@/components/HeaderBar";
import SongInput from "@/components/SongInput";
import EditBioButton from "@/components/EditBioButton";
import { Separator } from "@/components/ui/separator";

import { ArrowLeft } from "lucide-react";

type ProfilePageProps = {
    params: {
      // this came from the file name: [user_id].tsx
      user_id: string;
    };
};

export default async function ProfilePage({
    params: { user_id },
}: ProfilePageProps) {
	// const { auth } = useAuth();
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
            bio: usersTable.bio,
        })
        .from(usersTable)
        .where(eq(usersTable.displayId, user_id))
        .execute();
    if (!userData) errorRedirect();
    // console.log(userData);

    const uploadedSongsData = await db
        .select({
            // user_name: songsTable.userName,
            song_id: songsTable.id,
            song_name: songsTable.songName,
            singer_name: songsTable.singerName,
            song_link: songsTable.songLink,
            score: songsTable.avgScore,
            // created_at: songsTable.createdAt,
            // thumbnail: songsTable.thumbnail,
        })
        .from(songsTable)
        .where(eq(songsTable.userName, userData.name))
        .execute();
    // if (!uploadedSongsData) console.log("# uploaded songs: 0 or null");

    const reviewedSongsData = await db
        .select({
            // user_id: usersTable.id,
            song_id: songsTable.id,
            // created_at: scoresTable.createdAt,
            song_name: songsTable.songName,
            singer_name: songsTable.singerName,
            song_link: songsTable.songLink,
            score: scoresTable.score,
        })
        .from(scoresTable)
        .innerJoin(usersTable, eq(usersTable.name, scoresTable.userName))
        .innerJoin(songsTable, eq(songsTable.id, scoresTable.songId))
        .where(eq(scoresTable.userName, userData.name))
        .execute();
    // if (!reviewedSongsData) console.log("# reviewed songs: 0 or null");

    const uploadedSongsDataWithMode = uploadedSongsData.map((song) => ({
        ...song,
        mode: 0,
    }));
    const reviewedSongsDataWithMode = reviewedSongsData.map((song) => ({
        ...song,
        mode: 1,
    }));

	return (
		<div className="flex h-screen w-full flex-col overflow-auto pt-2">
			<HeaderBar />
			<Separator />
            <div className="flex-col">
                <div className="mb-2 flex items-center w-1/2 gap-8 px-4">
                    <Link href={{ pathname: "/" }}>
                        <ArrowLeft className="mt-4" size={32} />
                    </Link>
                    <h3 className="text-lg mt-4 font-bold text-center">Back to Menu</h3>
                </div>
                <div className="flex flex-row items-start justify-center px-4 mt-4">
                    <div className="p-6 rounded-lg shadow-md w-96">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-semibold mb-2">Profile Information</h2>
                            <EditBioButton userId={userData.id} bio={userData.bio} />
                        </div>
                        <Separator />
                        <div className="mt-4" />
                        <div className="mb-4">
                            <strong>Name:</strong> {userData.name}
                        </div>
                        <div className="mb-4">
                            <strong>Email:</strong> {userData.email}
                        </div>
                        <div className="mb-4">
                            <strong>Bio:</strong> <span className="break-words">{userData.bio}</span>
                        </div>
                    </div>
                    <div className="p-6 rounded-lg shadow-md w-96">
                        <h2 className="text-2xl font-semibold mb-2">Uploaded Songs</h2>
                        <Separator />
                        <SongInput songs={uploadedSongsDataWithMode} />
                    </div>
                    <div className="p-6 rounded-lg shadow-md w-96">
                        <h2 className="text-2xl font-semibold mb-2">Reviewed Songs</h2>
                        <Separator />
                        <SongInput songs={reviewedSongsDataWithMode} />
                    </div>
                </div>
            </div>
		</div>
	);
}
