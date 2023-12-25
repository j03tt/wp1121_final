import { useMemo, useState } from "react";

import { useSearchParams, useRouter } from "next/navigation";

// this is a helper function to get user info in client components
export default function useUserInfo() {
  const searchParams = useSearchParams();
  const username = useMemo(() => searchParams.get("username"), [searchParams]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const getUser = async () => {
    setLoading(true);

    const res = await fetch("/api/user", {
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
  }

  return {
    username,
  };
}