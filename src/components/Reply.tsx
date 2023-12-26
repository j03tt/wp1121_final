import { Separator } from "@/components/ui/separator";
import TimeText from "./TimeText";
import LikeButton from "./LikeButton";
import DislikeButton from "./DislikeButton";

type ReplyProps = {
  id: number;
  authorName: string;
  content: string;
  createdAt: Date;
  currentUser: string;
  liked?: boolean;
  likes: number;
  disliked?: boolean;
  dislikes: number;
};

export default function Reply({
  id,
  authorName,
  content,
  createdAt,
  currentUser,
  liked,
  likes,
  disliked,
  dislikes,
}: ReplyProps) {
  return (
    <>
        <div className="flex gap-4 w-full">
          <article className="flex grow flex-col w-full">
            <div className="flex flex-row">  
            <p className="font-bold w-full p-4">
              {authorName} wrote at
              <time className="ml-2 font-normal text-gray-400">
                <TimeText date={createdAt} format="h:mm A · D MMM YYYY" />
              </time>
            </p>
            <LikeButton 
              op={disliked!}
              initialLikes={likes}
              initialLiked={liked}
              userName={currentUser}
              commentId={id}></LikeButton>
            <DislikeButton 
              op={liked!}
              initialLikes={dislikes}
              initialLiked={disliked}
              userName={currentUser}
              commentId={id}></DislikeButton>
            </div>
            <div className="pl-4 pr-4 my-2 justify-between gap-4 w-full break-words">  
              <article className="mt-2 whitespace-pre-wrap ">
                {content}
              </article>
            </div>
          </article>
          
        </div>
      <Separator />
    </>
  );
}
