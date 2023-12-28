"use client";

import { useRef } from "react";
import { Input } from "@/components/ui/input";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import CatchingPokemonIcon from '@mui/icons-material/CatchingPokemon';

export default function SearchBar(){
  const router = useRouter();
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
    <div className="w-1/3 flex flex-row justify-center item-center gap-4">
      <Input
        placeholder="Search a song..."
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
        className="flex h-10 items-center rounded-full gap-2 p-3 text-start transition-colors duration-300 border border-gray-500 border-solid hover:bg-gray-200"
        onClick={handleSearch}
      >
        <CatchingPokemonIcon />
        <p className="text-sm font-bold">Capture</p>
      </button>
    </div>
  )
}
