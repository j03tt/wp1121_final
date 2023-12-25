import { useState } from "react";

import { useRouter } from "next/navigation";

export default function useScore() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const postScore = async ({
    songId, 
    userName, 
    score,
  }: {
    songId: number, 
    userName: string, 
    score: number,
  }) => {
    setLoading(true);
    
    const res = await fetch("/api/score", {
      method: "POST",
      body: JSON.stringify({
        songId, 
        userName, 
        score,
      }),
    });

    if (!res.ok) {
      const body = await res.json();
      throw new Error(body.error);
    }
    console.log(res);
    router.refresh();
    setLoading(false);
  };

  const deleteScore = async ({
    songId,
    userName,
  }: {
    songId: number,
    userName: string,
  }) => {
    if (loading) return;

    setLoading(true);
    const res = await fetch("/api/score", {
      method: "DELETE",
      body: JSON.stringify({
        songId,
        userName,
      }),
    });

    if (!res.ok) {
      const body = await res.json();
      throw new Error(body.error);
    }

    router.refresh();
    setLoading(false);
  };

  const putScore = async ({
    songId,
    userName,
    score,
  }: {
    songId: number,
    userName: string,
    score: number,
  }) => {
    setLoading(true);
    
    const res = await fetch("/api/score", {
      method: "PUT",
      body: JSON.stringify({
        songId,
        userName,
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

  return {
    postScore,
    deleteScore,
    putScore,
    loading,
  };
}
