import { useState } from "react";

import { useRouter } from "next/navigation";

export default function useScore() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const postScore = async ({
    songId, 
    userId, 
    score,
  }: {
    songId: number, 
    userId: number, 
    score: string,
  }) => {
    setLoading(true);

    const res = await fetch("/api/score", {
      method: "POST",
      body: JSON.stringify({
        songId, 
        userId, 
        score,
      }),
    });

    if (!res.ok) {
      const body = await res.json();
      throw new Error(body.error);
    }
    router.refresh();
    setLoading(false);
  };

  const deleteScore = async ({
    songId,
    userId,
  }: {
    songId: number,
    userId: number,
  }) => {
    if (loading) return;

    setLoading(true);
    const res = await fetch("/api/score", {
      method: "DELETE",
      body: JSON.stringify({
        songId,
        userId,
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
    postScore,
    deleteScore,
    loading,
  };
}
