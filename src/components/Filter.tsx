"use client";
import { useRef } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react"
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
export default function Filter(){
  const router = useRouter();
  const {data: session} = useSession();
  const username = session?.user?.name;
  const keywordInputRef = useRef<HTMLInputElement>(null);
  const pathname = usePathname();
  const searchParams = useSearchParams()
  const handleSearch = async () => {
    const keyword = keywordInputRef.current?.value;
    if(!keyword){
      // console.log(pathname)
      const params = new URLSearchParams(searchParams);
      params.delete("keyWord");
      router.push(`${pathname}?${params.toString()}`);
      return;
    }

    keywordInputRef.current.dispatchEvent(
      new Event("input", { bubbles: true, composed: true }),
    );
    const params = new URLSearchParams(searchParams);
    params.set("keyWord", keyword!);

    router.push(`${pathname}?${params.toString()}`);
  };
  
  return(
    <div className="w-full flex flex-row justify-center item-center">
      <Input
        placeholder="Enter Keyword."
        defaultValue={""}
        className = {"border-black-500 col-span-3"}
        ref={keywordInputRef}
        onKeyDown={(e) => {
            if(e.key == 'Enter') {
                handleSearch()
            }
        }}  
      />
      <button
        className="flex h-10 items-center rounded-full p-3 text-start transition-colors duration-300 border border-gray-500 border-solid hover:bg-gray-200"
        onClick={handleSearch}
        
      > 
        <Search />
        <p className="text-sm font-bold">Search!</p>
      </button>
    </div>
  )
}
