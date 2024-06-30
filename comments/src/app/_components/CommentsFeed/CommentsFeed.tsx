"use client";

import { useQuery } from "@tanstack/react-query";
import { v7 as uuidv7 } from "uuid";
import Comment from "../Comment/Comment";
import { type CommentObject } from "../Comment/Comment.types";
import { getCommentsFromLocalStorage } from "./CommentsFeed.helpers";

export default function CommentsFeed(): JSX.Element {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["allComments"],
    queryFn: async () => getCommentsFromLocalStorage(),
  });

  if (isLoading) {
    return (
      <div className="mx-auto flex min-w-[761px] max-w-[761px] flex-col items-start py-10">
        <h2>Loading comments...</h2>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="mx-auto flex min-w-[761px] max-w-[761px] flex-col items-start py-10">
        <div>Error: {isError}</div>
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-w-[761px] max-w-[761px] flex-col items-start py-10">
      {isLoading && <div>Loading...</div>}
      {isError || (!data && <div>Error: {isError}</div>)}
      {data.map((comment: CommentObject) => (
        <Comment
          key={uuidv7()}
          author={comment.author}
          commentText={comment.commentText}
          createdAt={comment.createdAt}
        />
      ))}
    </div>
  );
}
