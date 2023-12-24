import { useState } from "react";

import { useRouter } from "next/navigation";

export default function useSong() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const postSong = async ({
    userId,
    songName,
    singerName,
    songLink,
    thumbnail,
    reviewer,
    score,
  }: {
    username: number,
    songName: string,
    singerName: string,
    songLink: string,
    thumbnail: string,
    reviewer: number,
    score: number,
  }) => {
    setLoading(true);

    const res = await fetch("/api/song", {
      method: "POST",
      body: JSON.stringify({
        userId: userId,
        songName: songName,
        singerName: singerName,
        songLink: songLink,
        reviewers: reviewer,
        score: score,
        thumbnail: thumbnail,
      }),
    });
    if (!res.ok) {
      const body = await res.json();
      throw new Error(body.error);
    }
    
    router.refresh();
    setLoading(false);
  };

  const getSong = async () => {
    setLoading(true);

    const res = await fetch("/api/song", {
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

  const putSong = async ({
    reviewers,
    score,
  }: {
    reviewers: number,
    score:number,
  }) => {
    setLoading(true);

    const res = await fetch("/api/song", {
      method: "PUT",
      body: JSON.stringify({
        reviewers,
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
    postSong,
    getSong,
    putSong,
    loading,
  };
}
