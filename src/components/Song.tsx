import Link from "next/link";

// import { MessageCircle, Repeat2, Share } from "lucide-react";

import { Separator } from "@/components/ui/separator";
// import { getAvatar } from "@/lib/utils";

import LikeButton from "./LikeButton";
import TimeText from "./TimeText";

type SongProps = {
  username: string,
  id: number,
  songTitle: string,
  singer: string,
  reviewers: number,
  score: string,
  image: string
};

// note that the Tweet component is also a server component
// all client side things are abstracted away in other components
export default function Song({
    username,
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
        className="w-full px-4 pt-3 transition-colors hover:bg-gray-50"
        href={{
          pathname: `/songs/${id}`,
          query: {
            username,
          },
        }}
      >
        <div className="flex gap-4">
          <article className="flex grow flex-col">
            <img src={image} alt="Song image Src"/>
            <p className="font-bold">{singer} - {songTitle}</p> 
            <div className="my-2 flex items-center justify-between gap-4">  
              score: {score}, {reviewers} people had rated it.
            </div>
          </article>
        </div>
      </Link>
      <Separator />
    </>
  );
}
