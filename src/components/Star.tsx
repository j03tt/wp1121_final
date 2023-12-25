"use client";
import { Star } from "lucide-react";
import useScore from "@/hooks/useScore";
import useSong from "@/hooks/useSong";
import { useSession } from "next-auth/react";

type ReplyInputProps = {
  replyToSongId: number;
  userScore: string;
  CurrentScore: string;
  CurrentNum: number;
};

export default function RateStar({
  replyToSongId,
  userScore,
  CurrentScore,
  CurrentNum,
}: ReplyInputProps) {
  const {data: session} = useSession();
  const username = session?.user?.name;
  const { postScore, loading } = useScore();
  const { putSong, getSong } = useSong();
  const score = (userScore)? parseInt(userScore) : 0
  const current = parseFloat(CurrentScore)
  console.log("QQ:"+score)
  const handleReply = async (index:string) => {
    if (!username) return;
    
    try {
      if(score == 0) {
        console.log("uwu")
        await postScore({
            userName: username,
            songId: replyToSongId,
            score: index,
        });
        await putSong({
            avgScore: (current*CurrentNum+parseInt(index))/(CurrentNum+1),
            reviewers: (CurrentNum+1)
        })
      } else {
        console.log("owo")
        await putScore({
            userName: username,
            songId: replyToSongId,
            score: index,
        });
        await putSong({
            avgScore: (current*CurrentNum-score+parseInt(index))/(CurrentNum),
            reviewers: (CurrentNum+1)
        })
      }
    } catch (e) {
      console.error(e);
      alert("Error posting reply yeeeee");
    }
  };
{/* <Star color="#f6fa00" /> */}
  return (
    <div className="flex flex-row w-full items-center justify-around">
        <div className="flex flex-row w-1/6 items-center justify-around" >
            <button onClick={() => handleReply("1")}>
                {(score - 1 >= 0)? <Star size={20} color="#f6fa00" /> : <Star size={20}></Star>}
            </button>
            <button onClick={() => handleReply("2")}>
                {(score - 2 >= 0)? <Star size={20} color="#f6fa00" /> : <Star size={20}></Star>}
            </button>
            <button onClick={() => handleReply("3")}>
                {(score - 3 >= 0)? <Star size={20} color="#f6fa00" /> : <Star size={20}></Star>}
            </button>
            <button onClick={() => handleReply("4")}>
                {(score - 4 >= 0)? <Star size={20} color="#f6fa00" /> : <Star size={20}></Star>}
            </button>
            <button onClick={() => handleReply("5")}>
                {(score - 5 >= 0)? <Star size={20} color="#f6fa00" /> : <Star size={20}></Star>}
            </button>
        </div>
    
    </div>
  );
}
