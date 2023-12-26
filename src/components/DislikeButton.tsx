"use client";

import { useState } from "react";
import type { EventHandler, MouseEvent } from "react";

import { CheckCircle2, HeartOff } from "lucide-react";

import useDislike from "@/hooks/useDislike";
import useLike from "@/hooks/useLike";
import { cn } from "@/lib/utils";

type LikeButtonProps = {
  op: boolean;
  initialLikes: number;
  initialLiked?: boolean;
  userName: string;
  commentId?: number;
};

export default function DislikeButton({
  op,
  initialLikes,
  initialLiked,
  userName,
  commentId,
}: LikeButtonProps) {
  const [liked, setLiked] = useState(initialLiked);
  // console.log(initialLikes)
  const [likesCount, setLikesCount] = useState(initialLikes);
  // console.log(likesCount)
  const { postDislike, deleteDislike, loading } = useDislike();
  const { deleteLike } = useLike();

  const handleClick: EventHandler<MouseEvent> = async (e) => {
    e.stopPropagation();
    e.preventDefault();
    console.log(userName, commentId)
    if (!userName) return;
    if (!commentId) return;
    if (liked) {
      await deleteDislike({
        userName,
        commentId,
      });
      setLikesCount((prev) => prev - 1);
      setLiked(false);
    } else {
      await postDislike({
        userName,
        commentId,
      });
      if(op) {
        // console.log("opped")
        await deleteLike({
          userName,
          commentId,
        })
        window.location.reload();
      }
      setLikesCount((prev) => prev + 1);
      setLiked(true);
    }
  };

  const handleVisit: EventHandler<MouseEvent> = async (e) => {
    e.stopPropagation();
    e.preventDefault();
    alert("Log in to dislike the song >:D")
  };

  return (
    <button
      className={cn(
        "flex w-16 items-center gap-1 hover:text-brand",
        liked && "text-brand",
      )}
      onClick={(userName)? handleClick : handleVisit}
      disabled={loading}
    >
      <div
        className={"flex items-center gap-1 rounded-full p-1.5 transition-colors duration-300 hover:bg-brand/10"}>
        {
          (!liked)? <HeartOff size={18} /> : 
        <HeartOff color="#471212" size={18}/>
        }
        <span>{likesCount}</span>
      </div>
    </button>
  );
}
