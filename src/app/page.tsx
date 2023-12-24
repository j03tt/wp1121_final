import useAuth from "@/hooks/useAuth";

import HeaderBar from "@/components/HeaderBar";
import MainPage from "@/components/MainPage";
import { Separator } from "@/components/ui/separator";

export default async function Home() {
  const { auth } = useAuth();
  const session = await auth();

  return (
    <div className="flex h-screen w-full flex-col overflow-auto pt-2">
      <HeaderBar />
      <Separator />
      <MainPage />
    </div>
  );
}
