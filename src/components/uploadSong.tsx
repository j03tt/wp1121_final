"use client";
import { useState } from 'react';
import TweetDialog from '@/components/SongDialog'
import { Button } from "@/components/ui/button";

export default function NewActButton() {
  const [actDia, setActDia] = useState(false);

  return (
  <>
    <Button variant={"outline"}
      onClick={() => setActDia(true)}
    >
      Post!
    </Button>
    <TweetDialog
     open = {actDia}
     onClose={() => setActDia(false)}
    />
  </>
  );
}
