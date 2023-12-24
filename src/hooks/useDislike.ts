import { useState } from "react";

import { useRouter } from "next/navigation";

export default function useLike() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const postDislike = async ({
    userId,
    commentId,
  }: {
    userId: number;
    commentId: number;
  }) => {
    if (loading) return;
    setLoading(true);

    const res = await fetch("/api/dislike", {
      method: "POST",
      body: JSON.stringify({
        userId,
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

  const getDislikes = async () => {
    setLoading(true);

    const res = await fetch("/api/dislike", {
      method: "GET",
    });

    if (!res.ok) {
      const body = await res.json();
      throw new Error(body.error);
    }
    const data = await res.json();
    
    router.refresh();
    setLoading(false);
    return data;
  };

  const deleteDislike = async ({
    userId,
    commentId,
  }: {
    userId: number;
    commentId: number;
  }) => {
    if (loading) return;

    setLoading(true);
    const res = await fetch("/api/dislike", {
      method: "DELETE",
      body: JSON.stringify({
        userId,
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
    postDislike,
    getDislikes,
    deleteDislike,
    loading,
  };
}
