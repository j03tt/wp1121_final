import Link from "next/link";
import { redirect } from "next/navigation";

import { Separator } from "@/components/ui/separator";
import useAuth from "@/hooks/useAuth";
import { publicEnv } from "@/lib/env/public";

import SignOutButton from "./SignOutButton";

export default async function Navbar() {
  const { auth } = useAuth();
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId || !session?.user) {
    redirect(`${publicEnv.NEXT_PUBLIC_BASE_URL}/auth`);
  }
  // const projects = await getProjects(userId);
  return (
    <nav className="flex min-w-fit flex-col justify-between gap-2 overflow-hidden bg-gray-100">
      <div className="flex h-10 w-full flex-row items-center gap-12 px-6 py-8 pt-8">
        <h2 className="text-2xl font-bold" data-testid="title">
          Your Projects
        </h2>
      </div>
      <Separator />
      <div className="flex w-full items-center justify-between gap-8 px-4 py-2">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-200"></div>
          <span className="text-md font-semibold">
            {session?.user?.name}
          </span>
        </div>
        <SignOutButton />
      </div>
    </nav>
  );
}
