"use client";

import { useRef, useState } from "react";
import useBiography from '@/hooks/useBiography';
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
import { useSession } from "next-auth/react";

type EditBioDialogProps = {
    open: boolean;
    onClose: () => void;
    userId: number;
    bio: string | null;
};

export default function EditBioDialog({open, onClose, userId, bio }: EditBioDialogProps) {
  const BioInputRef = useRef<HTMLInputElement>(null);
  const { putBiography, loading } = useBiography();

  const handleSave = async () => {
    const newBio = BioInputRef.current?.value;

    try {
      await putBiography({ userId, bio: newBio || '' });
    } catch(e) {
      alert("Failed to save.");
      console.log(e);
    }
    onClose()
    return ;
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Bio</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="bio" className="text-right">
              New Bio
            </Label>
            <div className="col-span-3 flex items-center gap-2">
              <Input
                placeholder="Enter your new bio!"
                defaultValue={bio ? bio : ""}
                ref={BioInputRef}
              />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
