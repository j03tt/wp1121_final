"use client";

import { useState } from "react";
import type { EventHandler, MouseEvent } from "react";

import { CheckCircle2 } from "lucide-react";

import useLike from "@/hooks/useLikes";
import { cn } from "@/lib/utils";

type LikeButtonProps = {
  initialLikes: number;
  initialLiked?: boolean;
  userId: number;
  commentId?: number;
};

export default function LikeButton({
  initialLikes,
  initialLiked,
  userId,
  commentId,
}: LikeButtonProps) {
  const [liked, setLiked] = useState(initialLiked);
  // console.log(initialLikes)
  const [likesCount, setLikesCount] = useState(initialLikes);
  // console.log(likesCount)
  const { postLike, deleteLike, loading } = useLike();

  const handleClick: EventHandler<MouseEvent> = async (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (!userId) return;
    if (!commentId) return;
    if (liked) {
      await deleteLike({
        userId,
        commentId,
      });
      setLikesCount((prev) => prev - 1);
      setLiked(false);
    } else {
      await postLike({
        userId,
        commentId,
      });
      setLikesCount((prev) => prev + 1);
      setLiked(true);
    }
  };

  return (
    <button
      className={cn(
        "flex w-16 items-center gap-1 hover:text-brand",
        liked && "text-brand",
      )}
      onClick={handleClick}
      disabled={loading}
    >
      <div
        className={cn(
          "flex items-center gap-1 rounded-full p-1.5 transition-colors duration-300 hover:bg-brand/10",
          liked && "bg-brand/10",
        )}
      >
        <CheckCircle2 size={18} />
      </div>
    </button>
  );
}
