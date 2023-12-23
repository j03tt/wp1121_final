import Link from "next/link";
import { publicEnv } from "@/lib/env/public";

import useAuth from "@/hooks/useAuth";

export default async function MainPage() {
  const { auth } = useAuth();
  const session = await auth();

  return (
    <div className="flex flex-row items-center justify-between px-4 mb-4">
        Main Page Goes Here
    </div>
  );  
}
