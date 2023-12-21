"use client";
import { useState } from 'react';
import TweetDialog from '@/components/SongDialog'
export default function NewActButton() {
  const [actDia, setActDia] = useState(false);

  return (
  <>
    <button
      className="flex items-center gap-2 p-3 text-start transition-colors duration-300 border border-gray-800 rounded-none border-solid hover:bg-gray-200"
      onClick={() => setActDia(true)}
    >
      <p className="text-sm font-bold">Publish!</p>
    </button>
    <TweetDialog
     open = {actDia}
     onClose={() => setActDia(false)}
    />
  </>
  );
}
