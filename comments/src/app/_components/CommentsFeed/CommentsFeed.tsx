"use client";

import { useQuery } from "@tanstack/react-query";
import { v7 as uuidv7 } from "uuid";
import { Skeleton } from "~/components/ui/skeleton";
import Comment from "../Comment/Comment";
import { type CommentObject } from "../Comment/Comment.types";
import CommentForm from "../CommentForm/CommentForm";
import { getCommentsFromLocalStorage } from "./CommentsFeed.helpers";

export default function CommentsFeed(): JSX.Element {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["allComments"],
    queryFn: async () => getCommentsFromLocalStorage(),
  });

  return (
    <div className="mx-auto flex min-w-[761px] max-w-[761px] flex-col items-start py-10">
      <h2 className="mb-10 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
        Comments Demo App
      </h2>
      <h4 className="mb-3 scroll-m-20 text-xl font-semibold tracking-tight">
        Post a new comment here
      </h4>
      <div className="mb-5 w-full border-b-2 pb-5">
        <CommentForm />
      </div>
      <div className="w-full">
        {isLoading ? (
          <div className="flex items-center space-x-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[220px]" />
              <Skeleton className="h-4 w-[570px]" />
              <Skeleton className="h-4 w-[500px]" />
            </div>
          </div>
        ) : !data ? (
          <h4 className="mb-3 scroll-m-20 text-xl font-semibold tracking-tight">
            No comments posted yet... be the first?
          </h4>
        ) : isError ? (
          <h4 className="mb-3 scroll-m-20 text-xl font-semibold tracking-tight">
            There is an error retrieving the comments data
          </h4>
        ) : (
          data.map((comment: CommentObject) => (
            <Comment
              key={uuidv7()}
              author={comment.author}
              commentText={comment.commentText}
              createdAt={comment.createdAt}
            />
          ))
        )}
      </div>
    </div>
  );
}
