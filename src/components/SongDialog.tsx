"use client";

import { useRef, useState } from "react";
import useUserInfo from '@/hooks/useUserInfo'
import { useRouter } from "next/navigation";
import useSong from '@/hooks/useSong'
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { validateTimeFormat, validateTime, validateTimeDiff } from "@/lib/utils";
import { useSession } from "next-auth/react";

type actDiaProp = {
  open: boolean;
  onClose: () => void;
};

export default function SongDialog({open, onClose} : actDiaProp) {
  const titleInputRef = useRef<HTMLInputElement>(null);
  const singerInputRef = useRef<HTMLInputElement>(null);
  const linkInputRef = useRef<HTMLInputElement>(null);
  const srcInputRef = useRef<HTMLInputElement>(null);
  const { postSong, getSong } = useSong();
  const {data: session} = useSession();
  const username = session?.user?.name;
  const router = useRouter();

  const handleSave = async () => {
    const title = titleInputRef.current?.value;
    const singer = singerInputRef.current?.value;
    const link = linkInputRef.current?.value;
    const src = srcInputRef.current?.value;

    if(!(username && title && singer && link && src)) {
      alert('Invalid format, please try again.')
      return;
    }

    try {
      await postSong({
        userName: username,
        songName : title,
        singerName : singer,
        songLink : link,
        reviewers : 0,
        avgScore : 0,
        thumbnail : src,
      });
    } catch(e) {
      console.log(e);
    }
    onClose()
    return ;
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add A Song</DialogTitle>
          <DialogDescription>
            Add a song to the database!
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Song Title
            </Label>
            <div className="col-span-3 flex items-center gap-2">
              <Input
                placeholder="How do you name the song?"
                defaultValue={""}
                ref={titleInputRef}
              />
            </div>
            <Label htmlFor="name" className="text-right">
              Singer
            </Label>
            <div className="col-span-3 flex items-center gap-2">
              <Input
                placeholder="Who sang the song?"
                defaultValue={""}
                ref={singerInputRef}
              />
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Song Link
            </Label>
            <div className="col-span-3 flex items-center gap-2">
              <Input
                placeholder="link to the song"
                defaultValue={""}
                ref={linkInputRef}
              />
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Song thumbnail
            </Label>
            <div className="col-span-3 flex items-center gap-2">
              <Input
                placeholder="link to the thumbnail of the song"
                defaultValue={""}
                ref={srcInputRef}
              />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSave}>Post!</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
