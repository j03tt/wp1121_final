"use client";

import SongInProfile from "@/components/SongInProfile";

type Song = {
  song_id: number;
  song_name: string;
  singer_name: string;
  song_link: string;
  score: string;
};

interface SongInputProps {
  songs: Song[];
};

export default function SongInput({ songs }: SongInputProps) {
  return (
  <div>
      {songs.map((song) => (
        <SongInProfile
          key={song.song_id}
          song_id={song.song_id}
          song_name={song.song_name}
          singer_name={song.singer_name}
          song_link={song.song_link}
          score={song.score}
        />
      ))}
  </div>
  );
}
