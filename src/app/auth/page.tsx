import { redirect } from "next/navigation";

import { auth } from "@/hooks/useAuth";
import { publicEnv } from "@/lib/env/public";

import AuthForm from "./_components/AuthForm";

export default async function AuthPage() {
  // const { auth } = useAuth();

  // If signed in, redirect to /
  const session = await auth();

  if (session?.user?.id) {
    redirect(`${publicEnv.NEXT_PUBLIC_BASE_URL}`);
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <AuthForm />
    </main>
  );
}
