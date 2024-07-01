"use client";

import { useQuery } from "@tanstack/react-query";
import { LOCAL_STORAGE_ALL_COMMENTS_KEY } from "~/app/app.constants";
import { Skeleton } from "~/components/ui/skeleton";
import Comment from "../Comment/Comment";
import { type CommentObject } from "../Comment/Comment.types";
import CommentForm from "../CommentForm/CommentForm";
import { getCommentsFromLocalStorage } from "./CommentsFeed.helpers";

export default function CommentsFeed(): JSX.Element {
  const { data, isLoading, isError } = useQuery({
    queryKey: [LOCAL_STORAGE_ALL_COMMENTS_KEY],
    queryFn: async () => getCommentsFromLocalStorage(),
    staleTime: 0,
  });

  return (
    <div className="container mx-auto w-full">
      <div className="mx-auto w-full flex-col p-10 md:w-3/5 md:px-5 md:py-10">
        <h2 className="mb-10 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
          Comments Demo App
        </h2>
        <h4 className="mb-3 scroll-m-20 text-xl font-semibold tracking-tight">
          Post a new comment here
        </h4>
        <div className="w-full border-b-2 pb-5">
          <CommentForm />
        </div>
        <div className="w-full">
          {isLoading ? (
            <div className="flex items-center space-x-4">
              {/* TODO: Add skeletons back */}
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[150px]" />
                <Skeleton className="h-4 w-[300px]" />
                <Skeleton className="h-4 w-[270px]" />
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
            data.map((comment: CommentObject) => {
              return (
                <Comment
                  key={comment.commentId}
                  commentId={comment.commentId}
                  author={comment.author}
                  commentText={comment.commentText}
                  createdAt={comment.createdAt}
                  nestedComments={comment.nestedComments}
                />
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
