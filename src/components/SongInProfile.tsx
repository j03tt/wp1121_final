import Link from "next/link";

import { Separator } from "@/components/ui/separator";

type SongProps = {
    song_id: number;
    song_name: string;
    singer_name: string;
    song_link: string;
    score: string;
    mode: number;
};

export default function SongInProfile({
    song_id,
    song_name,
    singer_name,
    song_link,
    score,
    mode
}: SongProps) {
  return (
    <>
        <Link
            href={{
            pathname: `/songs/${song_id}`
            }}
        >
            <div className="flex gap-4">
            <article className="flex-grow flex-col group rounded-lg overflow-hidden">
                {/* <img src={image} alt="Song image Src"/> */}
                <div className="mt-4"></div>
                <div className="mb-4">
                    <strong>Singer:</strong> {singer_name}
                </div>
                <div className="mb-4">
                    <strong>Song:</strong> {song_name}
                </div>
                <div className="mb-4">
                    {mode === 0 ? (
                        <strong>Average Rating: </strong>
                    ) : mode === 1 ? (
                        <strong>Your Rating: </strong>
                    ) : null}
                    {score}
                </div>
            </article>
            </div>
        </Link>
        <Separator />

        <style jsx>{`
            .group:hover {
            transition: background-color 0.3s ease;
            }

            .group:hover {
            background-color: rgba(240, 240, 240, 0.2);
            }
        `}
        </style>
    </>
  );
}
