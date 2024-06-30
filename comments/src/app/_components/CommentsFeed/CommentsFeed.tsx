"use client";

import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { v7 as uuidv7 } from "uuid";
import Comment from "../Comment/Comment";
import { type CommentObject } from "../Comment/Comment.types";
import { LOCAL_STORAGE_ALL_COMMENTS_KEY } from "./CommentsFeed.constants";
import { getCommentsFromLocalStorage } from "./CommentsFeed.helpers";

export default function CommentsFeed(): JSX.Element {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["allComments"],
    queryFn: async () => getCommentsFromLocalStorage(),
  });

  useEffect(() => {
    const comment = {
      author: "John Doe",
      commentText: "This is a comment",
      createdAt: "2023-01-01",
    } as CommentObject;
    localStorage.setItem(
      LOCAL_STORAGE_ALL_COMMENTS_KEY,
      JSON.stringify([comment, comment, comment]),
    );
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
