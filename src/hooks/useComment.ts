import { useState } from "react";

import { useRouter } from "next/navigation";

export default function useComment() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const postComment = async ({
    songId, 
    userId, 
    content,
  }: {
    songId: number, 
    userId: number, 
    content: string,
  }) => {
    setLoading(true);

    const res = await fetch("/api/comments", {
      method: "POST",
      body: JSON.stringify({
        songId, 
        userId, 
        content,
      }),
    });

    if (!res.ok) {
      const body = await res.json();
      throw new Error(body.error);
    }
    router.refresh();
    setLoading(false);
  };

  const deleteComment = async ({
    songId,
    commentId,
  }: {
    songId: number,
    commentId: number,
  }) => {
    if (loading) return;

    setLoading(true);
    const res = await fetch("/api/comments", {
      method: "DELETE",
      body: JSON.stringify({
        songId,
        commentId,
      }),
    });

    if (!res.ok) {
      const body = await res.json();
      throw new Error(body.error);
    }

    router.refresh();
    setLoading(false);
  };

  return {
    postComment,
    deleteComment,
    loading,
  };
}
