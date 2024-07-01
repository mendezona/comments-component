"use client";

import { useQuery } from "@tanstack/react-query";
import { LOCAL_STORAGE_ALL_COMMENTS_KEY } from "~/app/app.constants";
import { Skeleton } from "~/components/ui/skeleton";
import Comment from "../Comment/Comment";
import { type CommentObject } from "../Comment/Comment.types";
import CommentForm from "../CommentForm/CommentForm";
import { DarkModeToggleButton } from "../DarkModeToggleButton";
import { getCommentsFromLocalStorage } from "./CommentsFeed.helpers";

export default function CommentsFeed(): JSX.Element {
  const { data, isLoading, isError } = useQuery({
    queryKey: [LOCAL_STORAGE_ALL_COMMENTS_KEY],
    queryFn: async () => getCommentsFromLocalStorage(),
  });
  const skeletons: unknown[] = Array.from({ length: 3 });

  return (
    <div className="mx-auto flex w-full">
      <div className="mx-auto w-full flex-col px-3 py-5 md:w-3/5 md:p-10 md:px-5 md:py-10">
        <div className="mb-10 flex justify-between border-b pb-2">
          <h2 className=" scroll-m-20  text-3xl font-semibold tracking-tight first:mt-0">
            Comments Demo App
          </h2>
          <DarkModeToggleButton />
        </div>
        <h4 className="mb-3 scroll-m-20 text-xl font-semibold tracking-tight">
          Post a new comment here
        </h4>
        <div className="w-full border-b-2 pb-5">
          <CommentForm />
        </div>
        <div className="mt-3 w-full">
          {isLoading ? (
            <>
              {skeletons.map((_, index) => (
                <div key={index} className="mb-10 flex items-center space-x-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[150px]" />
                    <Skeleton className="h-4 w-[200px] md:w-[400px]" />
                    <Skeleton className="h-4 w-[180px] md:w-[350px]" />
                  </div>
                </div>
              ))}
            </>
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
