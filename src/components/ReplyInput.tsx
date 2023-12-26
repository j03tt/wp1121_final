"use client";

import { useRef } from "react";

import GrowingTextarea from "@/components/GrowingTextarea";
// import UserAvatar from "@/components/UserAvatar";
import useComment from "@/hooks/useComment";
import { useSession } from "next-auth/react";
import { cn } from "@/lib/utils";

type ReplyInputProps = {
  replyToSongId: number;
};

export default function ReplyInput({
  replyToSongId,
}: ReplyInputProps) {
  const {data: session} = useSession();
  const username = session?.user?.name;
  const textareaRef = useRef<HTMLTextAreaElement>(null); 
  const { postComment, loading } = useComment();

  const handleReply = async () => {
    const content = textareaRef.current?.value;
    if (!content) return;
    if (!username) return;

    try {
      await postComment({
        userName: username,
        songId: replyToSongId,
        content,
      });
      textareaRef.current.value = "";
      textareaRef.current.dispatchEvent(
        new Event("input", { bubbles: true, composed: true }),
      );
      window.location.reload();
    } catch (e) {
      console.error(e);
      alert("Error posting reply!");
    }
  };

  const handleKey = (e:React.KeyboardEvent) => {
    if ((e.key === "Enter") && e.shiftKey === false) {
      e.preventDefault();
      handleReply();
    }
  }

  return (
    <div className="flex flex-row w-full justify-between" onClick={() => textareaRef.current?.focus()}>
      <div className="grid grid-cols-[fit-content(48px)_1fr] gap-4 w-full">
        <GrowingTextarea
          ref={textareaRef}
          wrapperClassName="col-start-2 row-start-2 overflow-auto"
          className="bg-transparent text-xl outline-none placeholder:text-gray-500 w-full break-all overflow-y-hidden"
          placeholder="Comment!"
          onKeyDown={handleKey}
        />
      </div>
      <div className="p-4">
        <button
          className={cn(
            "my-2 rounded-full bg-brand px-4 py-2 text-white transition-colors hover:bg-brand/70",
            "disabled:cursor-not-allowed disabled:bg-brand/40 disabled:hover:bg-brand/40 border-2 text-lg",
          )}
          onClick={handleReply}
          disabled={loading}
        >
          Send!
        </button>
      </div>
    </div>
  );
}
