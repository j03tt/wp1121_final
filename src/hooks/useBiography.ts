import { useState } from "react";

import { useRouter } from "next/navigation";

export default function useBiography() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const putBiography = async ({
    userId,
    bio,
  }: {
    userId: number,
    bio: string,
  }) => {
    setLoading(true);

    const res = await fetch("/api/biography", {
      method: "PUT",
      body: JSON.stringify({
        userId: userId,
        bio: bio,
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
    putBiography,
    loading,
  };
}
