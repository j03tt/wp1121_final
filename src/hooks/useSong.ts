import { useState } from "react";

import { useRouter } from "next/navigation";

export default function useSong() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const postSong = async ({
    userName,
    songName,
    singerName,
    songLink,
    thumbnail,
    reviewers,
    avgScore,
  }: {
    userName: string,
    songName: string,
    singerName: string,
    songLink: string,
    thumbnail: string,
    reviewers: number,
    avgScore: number,
  }) => {
    setLoading(true);

    const res = await fetch("/api/song", {
      method: "POST",
      body: JSON.stringify({
        userName: userName,
        songName: songName,
        singerName: singerName,
        songLink: songLink,
        thumbnail: thumbnail,
        reviewers: reviewers,
        avgScore: avgScore,
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
    songId,
    reviewers,
    avgScore,
  }: {
    songId: number,
    reviewers: number,
    avgScore:number,
  }) => {
    setLoading(true);

    const res = await fetch("/api/song", {
      method: "PUT",
      body: JSON.stringify({
        songId: songId,
        reviewers: reviewers,
        avgScore: avgScore,
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
