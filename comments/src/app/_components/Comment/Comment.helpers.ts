import { type QueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import { LOCAL_STORAGE_ALL_COMMENTS_KEY } from "../CommentsFeed/CommentsFeed.constants";
import { type CommentForm, type CommentObject } from "./Comment.types";

export default async function addNewComment(
  newComment: CommentForm,
  queryClient: QueryClient,
) {
  try {
    const previousComments = queryClient.getQueryData<CommentObject[]>([
      LOCAL_STORAGE_ALL_COMMENTS_KEY,
    ]);

    if (previousComments) {
      const newCommentWithTimestamp = {
        ...newComment,
        createdAt: dayjs().toString(),
      };
      const appendedComments = [...previousComments, newCommentWithTimestamp];
      const appendedCommentsString = JSON.stringify(appendedComments);
      localStorage.setItem(
        LOCAL_STORAGE_ALL_COMMENTS_KEY,
        appendedCommentsString,
      );
    }
  } catch (error) {
    console.error("Error:", error);
  }
}
