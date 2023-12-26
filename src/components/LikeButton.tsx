"use client";

import { useState } from "react";
import type { EventHandler, MouseEvent } from "react";

import { CheckCircle2, Heart } from "lucide-react";

import useLike from "@/hooks/useLike";
import useDislike from "@/hooks/useDislike";
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
  const { postLike, deleteLike, loading } = useLike();
  const { deleteDislike } = useDislike();

  const handleClick: EventHandler<MouseEvent> = async (e) => {
    e.stopPropagation();
    e.preventDefault();
    console.log(userName, commentId)
    if (!userName) return;
    if (!commentId) return;
    if (liked) {
      await deleteLike({
        userName,
        commentId,
      });
      setLikesCount((prev) => prev - 1);
      setLiked(false);
    } else {
      await postLike({
        userName,
        commentId,
      });
      if(op) {
        await deleteDislike({
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
    alert("Log in to like the song uwu")
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
          (!liked)? <Heart size={18} /> : 
        <Heart color="#fe7c7c" size={18}/>
        }
        <span>{likesCount}</span>
      </div>
    </button>
  );
}
