import Link from "next/link";

// import { MessageCircle, Repeat2, Share } from "lucide-react";

import { Separator } from "@/components/ui/separator";
import Image from "next/image";
// import { getAvatar } from "@/lib/utils";

// import LikeButton from "./LikeButton";
// import TimeText from "./TimeText";

type SongProps = {
  id: number,
  songTitle: string,
  singer: string,
  reviewers: number,
  score: string,
  image: string
};

export default function Song({
  id,
  songTitle,
  singer,
  reviewers,
  score,
  image
}: SongProps) {
return (
  <>
    <Link
      className="w-1/6 h-3/5 px-4 pt-3 transition-colors hover:bg-gray-700"
      href={{
        pathname: `/songs/${id}`,
      }}
    >
      <div className="flex gap-4">
        <article className="flex grow flex-col gap-3">
          <Image
            src={image}
            alt="Song image Src"
            className="w-full h-40 object-cover" // Set a fixed height, adjust as needed
          />
          <Separator />
          <p className="font-bold text-xl">{singer} <br/> {songTitle}</p> 
          <div className="my-2 flex items-center justify-between gap-4">  
            Score {score} <br/> {reviewers} People Rated.
          </div>
        </article>
      </div>
    </Link>
  </>
);
}
