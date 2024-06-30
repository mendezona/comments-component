import { type QueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import { LOCAL_STORAGE_ALL_COMMENTS_KEY } from "~/app/app.constants";
import { type CommentForm, type CommentObject } from "./Comment.types";

export default async function addNewComment(
  newComment: CommentForm,
  queryClient: QueryClient,
) {
  try {
    const newCommentWithTimestamp = {
      ...newComment,
      createdAt: dayjs().toString(),
    };
    const previousComments = queryClient.getQueryData<CommentObject[]>([
      LOCAL_STORAGE_ALL_COMMENTS_KEY,
    ]);

    if (previousComments) {
      const appendedComments = [...previousComments, newCommentWithTimestamp];
      const appendedCommentsString = JSON.stringify(appendedComments);
      localStorage.setItem(
        LOCAL_STORAGE_ALL_COMMENTS_KEY,
        appendedCommentsString,
      );
    } else {
      const newComments = [newCommentWithTimestamp];
      const newCommentsString = JSON.stringify(newComments);
      localStorage.setItem(LOCAL_STORAGE_ALL_COMMENTS_KEY, newCommentsString);
    }
  } catch (error) {
    console.error("Error:", error);
  }
}
