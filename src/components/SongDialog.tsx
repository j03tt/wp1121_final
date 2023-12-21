"use client";

import { useRef, useState } from "react";

import { useRouter } from "next/navigation";
import useTweet from '@/hooks/useTweet'
// import { useSearchParams } from "next/navigation";
import useUserInfo from '@/hooks/useUserInfo'
import useLike from "@/hooks/useLike"
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

type actDiaProp = {
  open: boolean;
  onClose: () => void;
};

export default function TweetDialog({open, onClose} : actDiaProp) {
  const titleInputRef = useRef<HTMLInputElement>(null);
  const fromInputRef = useRef<HTMLInputElement>(null);
  const toInputRef = useRef<HTMLInputElement>(null);
  const {username, handle} = useUserInfo();
  const [fromError, setFromError] = useState(false);
  const [cntError, setCntError] = useState(false);
  const [toError, setToError] = useState(false);
  const { postTweet, getTweet } = useTweet();
  const { likeTweet } = useLike();
  const router = useRouter();

  const handleSave = async () => {
    const content = titleInputRef.current?.value;
    const from = fromInputRef.current?.value;
    const to = toInputRef.current?.value;

    const newFromError = !validateTime(from);
    setFromError(newFromError);
    const newToError = !validateTime(to);
    setToError(newToError);

    if(!content){
      setCntError(true)
      return;
    }

    if(!from){
      setFromError(true);
      alert("Gotta know when the activity would take place, fill the starting time.")
      return;
    }
    
    if(!validateTimeFormat(from)){
      alert("That's not the time format used on the planet. Go to another universe or follow the format: YYYY-MM-DDTHH")
      return;
    }
    if(!validateTime(from)){
      alert("When is that starting time legal? Gotta make it correct.")
    }
    if(!to){
      setToError(true)
      alert("Does your activity last forever?")
      return;
    }
    if(!validateTimeFormat(to)){
      alert("We NEED the correct time format of end time of activity.The desired format: YYYY-MM-DDTHH")
      return;
    }
    if(!validateTime(to)){
      alert("Come on, you are capable to fill the correct time write?")
      return;
    }
    console.log(cntError)
    console.log(toError)
    console.log(fromError)
    const From = from + ":00:00";
    const To = to + ":00:00";
    if(!validateTimeDiff(From, To)){
      alert("The activity period may be out of range(may exceeded 7 days or it ends before it started.)")
      return;
    }

    try {
      await postTweet({
        handle,
        content,
        from, 
        to,
      });
    } catch(e) {
      console.log(e);
    }

    const crack = await getTweet()
    await likeTweet({
      tweetId: crack.id,
      userHandle: handle,
    })
    router.push(`/tweet/${crack.id}/?username=${username}&handle=${handle}`)
    onClose()
    return ;
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editting the activity</DialogTitle>
          <DialogDescription>
            Broadcast your thought!
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Title
            </Label>
            <div className="col-span-3 flex items-center gap-2">
              <Input
                placeholder="E.g. Stay with me"
                defaultValue={""}
                // className={cn(usernameError && "border-red-500", "col-span-3")}
                ref={titleInputRef}
              />
            </div>
            {
              // usernameError && (
              // <p className="col-span-3 col-start-2 text-xs text-red-500">
              //   Invalid username, use only{" "}
              //   <span className="font-mono">[a-z0-9 ]</span>, must be between 1
              //   and 50 characters long.
              // </p>
              // )
            }
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              From
            </Label>
            <div className="col-span-3 flex items-center gap-2">
              <Input
                placeholder="when it starts"
                defaultValue={""}
                // className={cn(handleError && "border-red-500")}
                ref={fromInputRef}
              />
            </div>
            {
              //handleError && (
            //   <p className="col-span-3 col-start-2 text-xs text-red-500">
            //     Invalid handle, use only{" "}
            //     <span className="font-mono">[a-z0-9\._-]</span>, must be between
            //     1 and 25 characters long.
            //   </p>
            // )
            }
            <Label htmlFor="name" className="text-right">
              To
            </Label>
            <div className="col-span-3 flex items-center gap-2">
              <Input
                placeholder="when it ends"
                defaultValue={""}
                // className={cn(handleError && "border-red-500")}
                ref={toInputRef}
              />
            </div>
            {
            //   handleError && (
            //   <p className="col-span-3 col-start-2 text-xs text-red-500">
            //     Invalid handle, use only{" "}
            //     <span className="font-mono">[a-z0-9\._-]</span>, must be between
            //     1 and 25 characters long.
            //   </p>
            // )
              }

          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSave}>Join me!</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
