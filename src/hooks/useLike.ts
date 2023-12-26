import { useState } from "react";

import { useRouter } from "next/navigation";

export default function useLike() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const postLike = async ({
    userName,
    commentId,
  }: {
    userName: string;
    commentId: number;
  }) => {
    if (loading) return;
    setLoading(true);

    const res = await fetch("/api/like", {
      method: "POST",
      body: JSON.stringify({
        userName: userName,
        commentId: commentId,
      }),
    });

    if (!res.ok) {
      const body = await res.json();
      throw new Error(body.error);
    }

    router.refresh();
    setLoading(false);
  };

  const getLikes = async () => {
    setLoading(true);

    const res = await fetch("/api/like", {
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

  const deleteLike = async ({
    userName,
    commentId,
  }: {
    userName: string;
    commentId: number;
  }) => {
    if (loading) return;

    setLoading(true);
    const res = await fetch("/api/like", {
      method: "DELETE",
      body: JSON.stringify({
        userName,
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
    postLike,
    getLikes,
    deleteLike,
    loading,
  };
}
