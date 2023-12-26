"use client";
import { useState } from 'react';
import EditBioDialog from "@/components/EditBioDialog"
import { Button } from "@/components/ui/button";

type EditBioProps = {
    userId: number;
    bio: string | null;
};

export default function EditBioButton({ userId, bio }: EditBioProps) {
  const [actDia, setActDia] = useState(false);

  return (
  <>
    <Button variant={"outline"}
      onClick={() => setActDia(true)}
    >
      Edit Bio
    </Button>
    <EditBioDialog
     open = {actDia}
     onClose={() => setActDia(false)}
     userId = {userId}
     bio = {bio}
    />
  </>
  );
}
