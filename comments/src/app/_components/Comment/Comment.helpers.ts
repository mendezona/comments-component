import { type QueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import { v7 as uuidv7 } from "uuid";
import { LOCAL_STORAGE_ALL_COMMENTS_KEY } from "~/app/app.constants";
import { type CommentForm, type CommentObject } from "./Comment.types";

export async function addNewComment(
  newComment: CommentForm,
  queryClient: QueryClient,
) {
  try {
    const newCommentWithTimestamp = {
      ...newComment,
      commentId: uuidv7().toString(),
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

export async function deleteComment(
  commentId: string,
  queryClient: QueryClient,
) {
  try {
    const currentComments: CommentObject[] | undefined =
      queryClient.getQueryData<CommentObject[]>([
        LOCAL_STORAGE_ALL_COMMENTS_KEY,
      ]);

    if (currentComments) {
      const removeCommentFromCurrentComments: CommentObject[] =
        currentComments.filter((comment) => comment.commentId !== commentId);
      const removeCommentFromCurrentCommentsString: string = JSON.stringify(
        removeCommentFromCurrentComments,
      );
      localStorage.setItem(
        LOCAL_STORAGE_ALL_COMMENTS_KEY,
        removeCommentFromCurrentCommentsString,
      );
    } else {
      console.log("Comment to deletenot found");
    }
  } catch (error) {
    console.error("Error:", error);
  }
}
